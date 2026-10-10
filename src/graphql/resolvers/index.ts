import { scalarResolvers } from './scalars';
import { userResolvers } from './user';
import { echoResolvers } from './echo';

export const resolvers = {
  ...scalarResolvers,
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...echoResolvers.Mutation,
  },
  Subscription: {
    ...echoResolvers.Subscription,
  },
};
