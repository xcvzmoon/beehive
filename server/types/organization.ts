import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { organizations } from '~/server/database/schema.ts';

export const selectOrganizationSchema = createSelectSchema(organizations);
export const insertOrganizationSchema = createInsertSchema(organizations);
export const updateOrganizationSchema = createUpdateSchema(organizations);

export type Organization = z.infer<typeof selectOrganizationSchema>;
export type InsertOrganizationInput = z.infer<typeof insertOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
