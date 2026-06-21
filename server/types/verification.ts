import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { verifications } from '~/server/database/schema.ts';

export const selectVerificationSchema = createSelectSchema(verifications);
export const insertVerificationSchema = createInsertSchema(verifications);
export const updateVerificationSchema = createUpdateSchema(verifications);

export type Verification = z.infer<typeof selectVerificationSchema>;
export type InsertVerificationInput = z.infer<typeof insertVerificationSchema>;
export type UpdateVerificationInput = z.infer<typeof updateVerificationSchema>;
