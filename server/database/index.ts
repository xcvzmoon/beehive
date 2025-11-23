import { poolConfigSchema } from '../types/pool-config';
import { useRuntimeConfig } from 'nitropack/runtime';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { EnhancedQueryLogger } from 'drizzle-query-logger';
import { applicationsTable } from '../database/schemas/public/applications';
import { servicesTable } from '../database/schemas/public/services';

export const poolConfig = poolConfigSchema.parse(useRuntimeConfig().db);

export const db = drizzle({
  client: new Pool(poolConfig),
  logger: new EnhancedQueryLogger(),
  schema: {
    applications: applicationsTable,
    services: servicesTable,
  },
});
