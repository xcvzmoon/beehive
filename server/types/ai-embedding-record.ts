import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiEmbeddingRecords } from '~/server/database/schema.ts';

export const selectAiEmbeddingRecordSchema = createSelectSchema(aiEmbeddingRecords);
export const insertAiEmbeddingRecordSchema = createInsertSchema(aiEmbeddingRecords);
export const updateAiEmbeddingRecordSchema = createUpdateSchema(aiEmbeddingRecords);

export type AiEmbeddingRecord = z.infer<typeof selectAiEmbeddingRecordSchema>;
export type InsertAiEmbeddingRecordInput = z.infer<typeof insertAiEmbeddingRecordSchema>;
export type UpdateAiEmbeddingRecordInput = z.infer<typeof updateAiEmbeddingRecordSchema>;
