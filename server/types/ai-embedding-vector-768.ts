import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiEmbeddingVectors768 } from '~/server/database/schema.ts';

export const selectAiEmbeddingVector768Schema = createSelectSchema(aiEmbeddingVectors768);
export const insertAiEmbeddingVector768Schema = createInsertSchema(aiEmbeddingVectors768);
export const updateAiEmbeddingVector768Schema = createUpdateSchema(aiEmbeddingVectors768);

export type AiEmbeddingVector768 = z.infer<typeof selectAiEmbeddingVector768Schema>;
export type InsertAiEmbeddingVector768Input = z.infer<typeof insertAiEmbeddingVector768Schema>;
export type UpdateAiEmbeddingVector768Input = z.infer<typeof updateAiEmbeddingVector768Schema>;
