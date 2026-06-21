import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { aiProviderCredentials } from '~/server/database/schema.ts';

export const selectAiProviderCredentialSchema = createSelectSchema(aiProviderCredentials);
export const insertAiProviderCredentialSchema = createInsertSchema(aiProviderCredentials);
export const updateAiProviderCredentialSchema = createUpdateSchema(aiProviderCredentials);

export type AiProviderCredential = z.infer<typeof selectAiProviderCredentialSchema>;
export type InsertAiProviderCredentialInput = z.infer<typeof insertAiProviderCredentialSchema>;
export type UpdateAiProviderCredentialInput = z.infer<typeof updateAiProviderCredentialSchema>;
