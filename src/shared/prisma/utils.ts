import { Prisma } from '@prisma/client';
import { exec } from 'child_process';
import * as util from 'util';

import prisma from './client';

const execPromisify = util.promisify(exec);

const tables = Prisma.dmmf.datamodel.models
  .map(model => model.dbName)
  .filter(table => table);

const clearMysql = async (): Promise<void> => {
  await prisma.$transaction([
    prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`,
    ...tables.map(table => prisma.$executeRawUnsafe(`TRUNCATE ${table};`)),
    prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`,
  ]);
};

const clearPostgres = async (): Promise<void> => {
  await prisma.$transaction([
    ...tables.map(table =>
      prisma.$executeRawUnsafe(`TRUNCATE ${table} CASCADE;`),
    ),
  ]);
};

type Provider = 'mysql' | 'postgres';

const clearDefault = async (): Promise<{
  stdout: string;
  stderr: string;
}> =>
  await execPromisify(
    'dotenv -e .env.test npx prisma migrate reset --force --skip-seed',
  );

export const clear = async (provider: Provider): Promise<void> => {
  const executeClear = {
    mysql: clearMysql,
    postgres: clearPostgres,
  };

  const execute = executeClear[provider] || clearDefault;
  return await execute();
};
