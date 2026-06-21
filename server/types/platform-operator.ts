import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { platformOperators } from '~/server/database/schema.ts';

export const selectPlatformOperatorSchema = createSelectSchema(platformOperators);
export const insertPlatformOperatorSchema = createInsertSchema(platformOperators);
export const updatePlatformOperatorSchema = createUpdateSchema(platformOperators);

export type PlatformOperator = z.infer<typeof selectPlatformOperatorSchema>;
export type InsertPlatformOperatorInput = z.infer<typeof insertPlatformOperatorSchema>;
export type UpdatePlatformOperatorInput = z.infer<typeof updatePlatformOperatorSchema>;
