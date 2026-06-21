import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { organizationMembers } from '~/server/database/schema.ts';

export const selectOrganizationMemberSchema = createSelectSchema(organizationMembers);
export const insertOrganizationMemberSchema = createInsertSchema(organizationMembers);
export const updateOrganizationMemberSchema = createUpdateSchema(organizationMembers);

export type OrganizationMember = z.infer<typeof selectOrganizationMemberSchema>;
export type InsertOrganizationMemberInput = z.infer<typeof insertOrganizationMemberSchema>;
export type UpdateOrganizationMemberInput = z.infer<typeof updateOrganizationMemberSchema>;
