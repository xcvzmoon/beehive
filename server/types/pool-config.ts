import { z } from 'zod';

export const poolConfigSchema = z.object({
  host: z.string(),
  port: z.transform(Number),
  database: z.string(),
  user: z.string(),
  password: z.string(),
  ssl: z.transform((value) => value === 'true'),
});

export type PoolConfig = z.infer<typeof poolConfigSchema>;
