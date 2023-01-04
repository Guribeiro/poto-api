import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function exclude<User, Key extends keyof User>(
  user: User,
  ...keys: Key[]
): Omit<User, Key> {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}

export { exclude };

export default prisma;
