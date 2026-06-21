import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiUsageEvents } from '~/server/database/schema.ts';

export const selectAiUsageEventSchema = createSelectSchema(aiUsageEvents);
export const insertAiUsageEventSchema = createInsertSchema(aiUsageEvents);
export const updateAiUsageEventSchema = createUpdateSchema(aiUsageEvents);

export type AiUsageEvent = z.infer<typeof selectAiUsageEventSchema>;
export type InsertAiUsageEventInput = z.infer<typeof insertAiUsageEventSchema>;
export type UpdateAiUsageEventInput = z.infer<typeof updateAiUsageEventSchema>;
