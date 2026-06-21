import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiToolCalls } from '~/server/database/schema.ts';

export const selectAiToolCallSchema = createSelectSchema(aiToolCalls);
export const insertAiToolCallSchema = createInsertSchema(aiToolCalls);
export const updateAiToolCallSchema = createUpdateSchema(aiToolCalls);

export type AiToolCall = z.infer<typeof selectAiToolCallSchema>;
export type InsertAiToolCallInput = z.infer<typeof insertAiToolCallSchema>;
export type UpdateAiToolCallInput = z.infer<typeof updateAiToolCallSchema>;
