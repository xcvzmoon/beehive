import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiConfigurations } from '~/server/database/schema.ts';

export const selectAiConfigurationSchema = createSelectSchema(aiConfigurations);
export const insertAiConfigurationSchema = createInsertSchema(aiConfigurations);
export const updateAiConfigurationSchema = createUpdateSchema(aiConfigurations);

export type AiConfiguration = z.infer<typeof selectAiConfigurationSchema>;
export type InsertAiConfigurationInput = z.infer<typeof insertAiConfigurationSchema>;
export type UpdateAiConfigurationInput = z.infer<typeof updateAiConfigurationSchema>;
