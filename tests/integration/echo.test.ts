import { createClient, type Client } from 'graphql-ws';
import WebSocket from 'ws';
import { startTestServer, type TestServer } from '../setup/testServer';
import { resetDatabase, disconnectDatabase } from '../setup/db';
import { graphqlRequest } from '../setup/graphqlClient';

const REGISTER = `mutation Register($input: RegisterInput!) { register(input: $input) { token } }`;
const SEND_ECHO = `mutation Send($message: String!) { sendEcho(message: $message) }`;
const ECHO_RECEIVED = `subscription { echoReceived { message sentBy } }`;

async function registerUser(origin: string, email: string) {
  const res = await graphqlRequest<{ register: { token: string } }>(origin, REGISTER, {
    input: { email, password: 'password123', displayName: email.split('@')[0] },
  });
  return res.data!.register.token;
}

function makeWsClient(wsUrl: string, token?: string): Client {
  return createClient({
    url: wsUrl,
    webSocketImpl: WebSocket,
    connectionParams: token ? { authorization: `Bearer ${token}` } : {},
    retryAttempts: 0,
  });
}

/** Subscribes and resolves with the first event (or rejects on a protocol/GraphQL error). */
function nextEvent<T>(client: Client, query: string): Promise<T> {
  return new Promise((resolve, reject) => {
    client.subscribe<T>(
      { query },
      {
        next: (msg) => {
          if (msg.errors && msg.errors.length > 0) {
            reject(msg.errors[0]);
            return;
          }
          resolve(msg.data as T);
        },
        error: (err) => reject(err),
        complete: () => reject(new Error('subscription completed with no data')),
      },
    );
  });
}

describe('echo subscription over the WebSocket transport', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = await startTestServer();
  });

  afterAll(async () => {
    await server.close();
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('pushes a published message to an authenticated subscriber', async () => {
    const token = await registerUser(server.origin, 'echo-user@example.com');

    const client = makeWsClient(server.wsUrl, token);
    try {
      const eventPromise = nextEvent<{ echoReceived: { message: string } }>(client, ECHO_RECEIVED);

      // Give the server a moment to register the subscription before publishing.
      await new Promise((resolve) => setTimeout(resolve, 200));

      const res = await graphqlRequest(server.origin, SEND_ECHO, { message: 'hello' }, token);
      expect(res.errors).toBeUndefined();

      const event = await eventPromise;
      expect(event.echoReceived.message).toBe('hello');
    } finally {
      client.dispose();
    }
  });

  it('rejects a subscription attempt with no authentication', async () => {
    const client = makeWsClient(server.wsUrl);
    try {
      await expect(nextEvent(client, ECHO_RECEIVED)).rejects.toBeTruthy();
    } finally {
      client.dispose();
    }
  });

  it('rejects the mutation when unauthenticated', async () => {
    const res = await graphqlRequest(server.origin, SEND_ECHO, { message: 'nope' });
    expect(res.errors?.[0]?.extensions?.code).toBe('UNAUTHENTICATED');
  });
});
