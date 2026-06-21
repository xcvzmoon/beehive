import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { sessions } from '~/server/database/schema.ts';

export const selectSessionSchema = createSelectSchema(sessions);
export const insertSessionSchema = createInsertSchema(sessions);
export const updateSessionSchema = createUpdateSchema(sessions);

export type Session = z.infer<typeof selectSessionSchema>;
export type InsertSessionInput = z.infer<typeof insertSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
