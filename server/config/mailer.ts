import { z } from 'zod';

export const mailerConfigSchema = z.object({
  host: z.string().regex(/^[a-zA-Z0-9.-]+$/, { error: 'MAILER_CONFIG_ERROR: INVALID_SMTP_HOST' }),
  port: z.coerce.number({ error: 'MAILER_CONFIG_ERROR: INVALID_SMTP_PORT' }).gte(0).lte(65_535),
  secure: z.stringbool({ error: 'MAILER_CONFIG_ERROR: INVALID_SMTP_SECURE' }),
  user: z.string({ error: 'MAILER_CONFIG_ERROR: INVALID_SMTP_USER' }).min(1).max(255),
  password: z.string({ error: 'MAILER_CONFIG_ERROR: INVALID_SMTP_PASSWORD' }).min(1).max(255),
});

export const mailerConfig = mailerConfigSchema.parse({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
});

export const fromSchema = z
  .email({ error: 'MAILER_CONFIG_ERROR: INVALID_SMTP_EMAIL' })
  .min(1)
  .max(255);

export const from = fromSchema.parse(process.env.SMTP_EMAIL);
