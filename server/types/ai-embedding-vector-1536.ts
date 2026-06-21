import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiEmbeddingVectors1536 } from '~/server/database/schema.ts';

export const selectAiEmbeddingVector1536Schema = createSelectSchema(aiEmbeddingVectors1536);
export const insertAiEmbeddingVector1536Schema = createInsertSchema(aiEmbeddingVectors1536);
export const updateAiEmbeddingVector1536Schema = createUpdateSchema(aiEmbeddingVectors1536);

export type AiEmbeddingVector1536 = z.infer<typeof selectAiEmbeddingVector1536Schema>;
export type InsertAiEmbeddingVector1536Input = z.infer<typeof insertAiEmbeddingVector1536Schema>;
export type UpdateAiEmbeddingVector1536Input = z.infer<typeof updateAiEmbeddingVector1536Schema>;
