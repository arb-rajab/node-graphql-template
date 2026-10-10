import request from 'supertest';
import { startTestServer, type TestServer } from '../setup/testServer';

describe('health', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = await startTestServer();
  });

  afterAll(async () => {
    await server.close();
  });

  it('serves /healthz without authentication', async () => {
    const res = await request(server.origin).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
