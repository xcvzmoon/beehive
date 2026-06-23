import { z } from 'zod';

const apiKeyConfigSchema = z.object({
  pepper: z
    .string({ error: 'API_KEY_CONFIG_ERROR: INVALID_API_KEY_PEPPER' })
    .min(32, { error: 'API_KEY_CONFIG_ERROR: API_KEY_PEPPER_TOO_SHORT' }),
  environment: z.enum(['live', 'test']).default('live'),
});

export const apiKeyConfig = apiKeyConfigSchema.parse({
  pepper: process.env.API_KEY_PEPPER,
  environment: process.env.API_KEY_ENVIRONMENT,
});
