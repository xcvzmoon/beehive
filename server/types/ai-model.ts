import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiModels } from '~/server/database/schema.ts';

export const selectAiModelSchema = createSelectSchema(aiModels);
export const insertAiModelSchema = createInsertSchema(aiModels);
export const updateAiModelSchema = createUpdateSchema(aiModels);

export type AiModel = z.infer<typeof selectAiModelSchema>;
export type InsertAiModelInput = z.infer<typeof insertAiModelSchema>;
export type UpdateAiModelInput = z.infer<typeof updateAiModelSchema>;
