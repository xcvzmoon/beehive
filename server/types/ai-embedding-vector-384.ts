import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiEmbeddingVectors384 } from '~/server/database/schema.ts';

export const selectAiEmbeddingVector384Schema = createSelectSchema(aiEmbeddingVectors384);
export const insertAiEmbeddingVector384Schema = createInsertSchema(aiEmbeddingVectors384);
export const updateAiEmbeddingVector384Schema = createUpdateSchema(aiEmbeddingVectors384);

export type AiEmbeddingVector384 = z.infer<typeof selectAiEmbeddingVector384Schema>;
export type InsertAiEmbeddingVector384Input = z.infer<typeof insertAiEmbeddingVector384Schema>;
export type UpdateAiEmbeddingVector384Input = z.infer<typeof updateAiEmbeddingVector384Schema>;
