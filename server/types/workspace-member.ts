import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { workspaceMembers } from '~/server/database/schema.ts';

export const selectWorkspaceMemberSchema = createSelectSchema(workspaceMembers);
export const insertWorkspaceMemberSchema = createInsertSchema(workspaceMembers);
export const updateWorkspaceMemberSchema = createUpdateSchema(workspaceMembers);

export type WorkspaceMember = z.infer<typeof selectWorkspaceMemberSchema>;
export type InsertWorkspaceMemberInput = z.infer<typeof insertWorkspaceMemberSchema>;
export type UpdateWorkspaceMemberInput = z.infer<typeof updateWorkspaceMemberSchema>;
