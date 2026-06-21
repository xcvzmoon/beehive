import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { accounts } from '~/server/database/schema.ts';

export const selectAccountSchema = createSelectSchema(accounts);
export const insertAccountSchema = createInsertSchema(accounts);
export const updateAccountSchema = createUpdateSchema(accounts);

export type Account = z.infer<typeof selectAccountSchema>;
export type InsertAccountInput = z.infer<typeof insertAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
