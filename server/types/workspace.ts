import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { workspaces } from '~/server/database/schema.ts';

export const selectWorkspaceSchema = createSelectSchema(workspaces);
export const insertWorkspaceSchema = createInsertSchema(workspaces);
export const updateWorkspaceSchema = createUpdateSchema(workspaces);

export type Workspace = z.infer<typeof selectWorkspaceSchema>;
export type InsertWorkspaceInput = z.infer<typeof insertWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
