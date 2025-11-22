import { z } from 'zod';
import { defineConfig } from 'drizzle-kit';

const poolConfig = z
  .object({
    host: z.string(),
    port: z.number(),
    database: z.string(),
    user: z.string(),
    password: z.string(),
    ssl: z.boolean(),
  })
  .parse({
    host: process.env.NITRO_DB_HOST,
    port: Number(process.env.NITRO_DB_PORT),
    database: process.env.NITRO_DB_DATABASE,
    user: process.env.NITRO_DB_USER,
    password: process.env.NITRO_DB_PASSWORD,
    ssl: process.env.NITRO_DB_SSL === 'true',
  });

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    host: poolConfig.host,
    port: poolConfig.port,
    database: poolConfig.database,
    user: poolConfig.user,
    password: poolConfig.password,
    ssl: poolConfig.ssl,
  },
  schema: './server/database/schemas/**/*.ts',
  out: './server/database/migrations',
  schemaFilter: [],
  tablesFilter: [],
  verbose: true,
  strict: true,
});
