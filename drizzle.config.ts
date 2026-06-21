import { defineConfig } from 'drizzle-kit';
import { databaseConfig } from '~/server/config/database.ts';

export default defineConfig({
  dbCredentials: databaseConfig,
  dialect: 'postgresql',
  casing: 'snake_case',
  schema: './server/database/schema.ts',
  out: 'server/database/migration',
  strict: true,
  verbose: true,
});
