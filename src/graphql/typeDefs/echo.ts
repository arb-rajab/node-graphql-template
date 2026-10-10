import gql from 'graphql-tag';

/**
 * Minimal example of an authenticated mutation + subscription pair. It
 * exists so the WebSocket path is exercised end to end; replace it with a
 * real domain module.
 */
export const echoTypeDefs = gql`
  type EchoEvent {
    message: String!
    sentBy: ID!
    sentAt: DateTime!
  }

  extend type Mutation {
    "Publishes a message to every authenticated echo subscriber."
    sendEcho(message: String!): Boolean!
  }

  extend type Subscription {
    echoReceived: EchoEvent!
  }
`;
