import { z } from 'zod';

export const databaseConfigSchema = z.object({
  user: z.string({ error: 'DB_CONFIG_ERROR: INVALID_DB_USER' }).min(1).max(255),
  password: z.string({ error: 'DB_CONFIG_ERROR: INVALID_DB_PASSWORD' }).min(1).max(255),
  host: z.string({ error: 'DB_CONFIG_ERROR: INVALID_DB_HOST' }).min(1).max(255),
  port: z.coerce.number({ error: 'DB_CONFIG_ERROR: INVALID_DB_PORT' }).gte(0).lte(65_535),
  database: z.string({ error: 'DB_CONFIG_ERROR: INVALID_DB_DATABASE' }).min(1).max(255),
  ssl: z.stringbool({ error: 'DB_CONFIG_ERROR: INVALID_DB_SSL' }),
});

export const databaseConfig = databaseConfigSchema.parse({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL,
});
