import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiMessages } from '~/server/database/schema.ts';

export const selectAiMessageSchema = createSelectSchema(aiMessages);
export const insertAiMessageSchema = createInsertSchema(aiMessages);
export const updateAiMessageSchema = createUpdateSchema(aiMessages);

export type AiMessage = z.infer<typeof selectAiMessageSchema>;
export type InsertAiMessageInput = z.infer<typeof insertAiMessageSchema>;
export type UpdateAiMessageInput = z.infer<typeof updateAiMessageSchema>;
