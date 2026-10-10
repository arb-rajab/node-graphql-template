import { prisma } from '../../src/db/prisma';

export async function resetDatabase(): Promise<void> {
  await prisma.$transaction([prisma.user.deleteMany()]);
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
