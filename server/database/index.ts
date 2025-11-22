import { z } from 'zod';
import { useRuntimeConfig } from 'nitropack/runtime';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { EnhancedQueryLogger } from 'drizzle-query-logger';

export const poolConfig = z
  .object({
    host: z.string(),
    port: z.number(),
    database: z.string(),
    user: z.string(),
    password: z.string(),
    ssl: z.boolean(),
  })
  .parse(useRuntimeConfig().db);

export const db = drizzle({
  client: new Pool(poolConfig),
  logger: new EnhancedQueryLogger(),
});
