import { poolConfigSchema } from './server/types/pool-config';
import { defineConfig } from 'drizzle-kit';

const poolConfig = poolConfigSchema.parse({
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
