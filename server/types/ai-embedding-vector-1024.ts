import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiEmbeddingVectors1024 } from '~/server/database/schema.ts';

export const selectAiEmbeddingVector1024Schema = createSelectSchema(aiEmbeddingVectors1024);
export const insertAiEmbeddingVector1024Schema = createInsertSchema(aiEmbeddingVectors1024);
export const updateAiEmbeddingVector1024Schema = createUpdateSchema(aiEmbeddingVectors1024);

export type AiEmbeddingVector1024 = z.infer<typeof selectAiEmbeddingVector1024Schema>;
export type InsertAiEmbeddingVector1024Input = z.infer<typeof insertAiEmbeddingVector1024Schema>;
export type UpdateAiEmbeddingVector1024Input = z.infer<typeof updateAiEmbeddingVector1024Schema>;
