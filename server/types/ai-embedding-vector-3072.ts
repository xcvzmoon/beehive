import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiEmbeddingVectors3072 } from '~/server/database/schema.ts';

export const selectAiEmbeddingVector3072Schema = createSelectSchema(aiEmbeddingVectors3072);
export const insertAiEmbeddingVector3072Schema = createInsertSchema(aiEmbeddingVectors3072);
export const updateAiEmbeddingVector3072Schema = createUpdateSchema(aiEmbeddingVectors3072);

export type AiEmbeddingVector3072 = z.infer<typeof selectAiEmbeddingVector3072Schema>;
export type InsertAiEmbeddingVector3072Input = z.infer<typeof insertAiEmbeddingVector3072Schema>;
export type UpdateAiEmbeddingVector3072Input = z.infer<typeof updateAiEmbeddingVector3072Schema>;
