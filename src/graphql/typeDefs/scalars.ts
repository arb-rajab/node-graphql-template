import gql from 'graphql-tag';

export const scalarTypeDefs = gql`
  """
  ISO-8601 date-time string, e.g. 2026-01-01T12:00:00.000Z.
  """
  scalar DateTime

  """
  Arbitrary JSON payload.
  """
  scalar JSON
`;
