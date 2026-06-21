import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { apiKeys } from '~/server/database/schema.ts';

export const selectApiKeySchema = createSelectSchema(apiKeys);
export const insertApiKeySchema = createInsertSchema(apiKeys);
export const updateApiKeySchema = createUpdateSchema(apiKeys);

export type ApiKey = z.infer<typeof selectApiKeySchema>;
export type InsertApiKeyInput = z.infer<typeof insertApiKeySchema>;
export type UpdateApiKeyInput = z.infer<typeof updateApiKeySchema>;
