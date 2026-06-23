import type { InsertWorkspaceMemberInput } from '~/server/types/workspace-member.ts';
import type { InsertWorkspaceInput, Workspace } from '~/server/types/workspace.ts';
import { eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { workspaceMembers, workspaces } from '~/server/database/schema.ts';
import { databaseEffect } from '~/server/utils/effects.ts';
import { logger } from '~/server/utils/logger.ts';

export function selectWorkspaceOrganizationId(id: Workspace['id']) {
  return databaseEffect({
    table: 'workspaces',
    callback: 'selectWorkspaceOrganizationId',
    execute: async () => {
      const result = await db
        .select({ organizationId: workspaces.organizationId })
        .from(workspaces)
        .where(eq(workspaces.id, id))
        .limit(1);

      return result.at(0)?.organizationId;
    },
  });
}

export function insertWorkspaceWithOwner(
  workspace: InsertWorkspaceInput,
  owner: Omit<InsertWorkspaceMemberInput, 'workspaceId'>,
) {
  return databaseEffect({
    table: 'workspaces',
    callback: 'insertWorkspaceWithOwner',
    execute: async () => {
      const createdWorkspace = await db.transaction(async (tx) => {
        const result = await tx.insert(workspaces).values(workspace).returning();
        const insertedWorkspace = result.at(0);

        if (!insertedWorkspace) {
          throw new Error('Insert returned no workspace');
        }

        await tx.insert(workspaceMembers).values({ ...owner, workspaceId: insertedWorkspace.id });

        return insertedWorkspace;
      });

      logger.success(`Inserted workspace with owner -> ${createdWorkspace.id}`);

      return createdWorkspace;
    },
  });
}

export function insertWorkspace(input: InsertWorkspaceInput) {
  return databaseEffect({
    table: 'workspaces',
    callback: 'insertWorkspace',
    execute: async () => {
      const result = await db.insert(workspaces).values(input).returning();
      const workspace = result.at(0);

      logger.success(`Inserted workspace -> ${workspace?.id}`);

      return workspace;
    },
  });
}
