import { z } from 'zod';

export const appConfigSchema = z.object({
  enableTerminalLogs: z.stringbool().optional().default(false),
});

export const appConfig = appConfigSchema.parse({
  enableTerminalLogs: process.env.APP_ENABLE_TERMINAL_LOGS,
});
