import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

export function createDatabase(databaseUrl: string) {
  if (databaseUrl.trim().length === 0) {
    throw new Error('DATABASE_URL must not be empty');
  }

  const client = postgres(databaseUrl, {
    max: 10,
    prepare: false,
  });

  return {
    db: drizzle(client, { schema }),
    close: () => client.end(),
  };
}

export type Database = ReturnType<typeof createDatabase>['db'];
export type DatabaseConnection = ReturnType<typeof createDatabase>;
