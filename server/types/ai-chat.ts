import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiChats } from '~/server/database/schema.ts';

export const selectAiChatSchema = createSelectSchema(aiChats);
export const insertAiChatSchema = createInsertSchema(aiChats);
export const updateAiChatSchema = createUpdateSchema(aiChats);

export type AiChat = z.infer<typeof selectAiChatSchema>;
export type InsertAiChatInput = z.infer<typeof insertAiChatSchema>;
export type UpdateAiChatInput = z.infer<typeof updateAiChatSchema>;
