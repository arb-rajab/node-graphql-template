import type { GraphQLContext } from '../context';
import { pubsub, ECHO_TOPIC } from '../pubsub';
import { requireUser } from './user';

interface EchoEvent {
  message: string;
  sentBy: string;
  sentAt: Date;
}

export const echoResolvers = {
  Mutation: {
    sendEcho: async (_parent: unknown, args: { message: string }, ctx: GraphQLContext) => {
      const user = requireUser(ctx);
      const event: EchoEvent = { message: args.message, sentBy: user.sub, sentAt: new Date() };
      await pubsub.publish(ECHO_TOPIC, { echoReceived: event });
      return true;
    },
  },
  Subscription: {
    echoReceived: {
      subscribe: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
        requireUser(ctx);
        return pubsub.asyncIterableIterator<EchoEvent>(ECHO_TOPIC);
      },
    },
  },
};
