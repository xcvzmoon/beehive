import type { InsertWorkspaceMemberInput } from '~/server/types/workspace-member.ts';
import { and, eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { workspaceMembers } from '~/server/database/schema.ts';

export async function findWorkspaceMember(workspaceId: string, userId: string) {
  const [member] = await db
    .select({ organizationId: workspaceMembers.organizationId, role: workspaceMembers.role })
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
    .limit(1);
  return member;
}

export async function insertWorkspaceMember(input: InsertWorkspaceMemberInput) {
  const [member] = await db.insert(workspaceMembers).values(input).returning();
  return member;
}
