import { PubSub } from 'graphql-subscriptions';

/**
 * Single in-process event bus backing GraphQL subscriptions. Swappable for a
 * distributed implementation (e.g. graphql-redis-subscriptions) behind the
 * same PubSub interface if the service ever runs as more than one instance.
 */
export const pubsub = new PubSub();

export const ECHO_TOPIC = 'ECHO_RECEIVED';
