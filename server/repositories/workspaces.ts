import type { InsertWorkspaceMemberInput } from '~/server/types/workspace-member.ts';
import type { InsertWorkspaceInput } from '~/server/types/workspace.ts';
import { eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { workspaceMembers, workspaces } from '~/server/database/schema.ts';

export async function findWorkspaceOrganizationId(id: string) {
  const [workspace] = await db
    .select({ organizationId: workspaces.organizationId })
    .from(workspaces)
    .where(eq(workspaces.id, id))
    .limit(1);
  return workspace?.organizationId;
}

export async function createWorkspaceWithOwner(
  workspace: InsertWorkspaceInput,
  owner: Omit<InsertWorkspaceMemberInput, 'workspaceId'>,
) {
  return db.transaction(async (tx) => {
    const [createdWorkspace] = await tx.insert(workspaces).values(workspace).returning();
    await tx.insert(workspaceMembers).values({ ...owner, workspaceId: createdWorkspace.id });
    return createdWorkspace;
  });
}

export async function insertWorkspace(input: InsertWorkspaceInput) {
  const [workspace] = await db.insert(workspaces).values(input).returning();
  return workspace;
}
