import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { organizationInvites } from '~/server/database/schema.ts';

export const selectOrganizationInviteSchema = createSelectSchema(organizationInvites);
export const insertOrganizationInviteSchema = createInsertSchema(organizationInvites);
export const updateOrganizationInviteSchema = createUpdateSchema(organizationInvites);

export type OrganizationInvite = z.infer<typeof selectOrganizationInviteSchema>;
export type InsertOrganizationInviteInput = z.infer<typeof insertOrganizationInviteSchema>;
export type UpdateOrganizationInviteInput = z.infer<typeof updateOrganizationInviteSchema>;
