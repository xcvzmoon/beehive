import { drizzle } from 'drizzle-orm/postgres-js';
import { EnhancedQueryLogger } from 'drizzle-query-logger';
import { databaseConfig } from '~/server/config/database.ts';
import { relations } from '~/server/database/relations.ts';
import * as schema from '~/server/database/schema.ts';

export const db = drizzle({
  connection: databaseConfig,
  logger: new EnhancedQueryLogger(),
  casing: 'snake_case',
  relations,
  schema,
});
