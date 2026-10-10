import type { AccessTokenPayload } from '../auth/jwt';
import { prisma } from '../db/prisma';
import { UserService } from '../services/userService';

export type AuthenticatedUser = AccessTokenPayload;

export interface GraphQLContext {
  user: AuthenticatedUser | null;
  services: {
    users: UserService;
  };
}

export function buildContext(user: AuthenticatedUser | null): GraphQLContext {
  return {
    user,
    services: {
      users: new UserService(prisma),
    },
  };
}
