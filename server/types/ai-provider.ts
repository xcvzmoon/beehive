import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiProviders } from '~/server/database/schema.ts';

export const selectAiProviderSchema = createSelectSchema(aiProviders);
export const insertAiProviderSchema = createInsertSchema(aiProviders);
export const updateAiProviderSchema = createUpdateSchema(aiProviders);

export type AiProvider = z.infer<typeof selectAiProviderSchema>;
export type InsertAiProviderInput = z.infer<typeof insertAiProviderSchema>;
export type UpdateAiProviderInput = z.infer<typeof updateAiProviderSchema>;
