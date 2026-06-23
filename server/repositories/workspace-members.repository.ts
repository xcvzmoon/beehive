import type {
  InsertWorkspaceMemberInput,
  WorkspaceMember,
} from '~/server/types/workspace-member.ts';
import { and, eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { workspaceMembers } from '~/server/database/schema.ts';
import { databaseEffect } from '~/server/utils/effects.ts';
import { logger } from '~/server/utils/logger.ts';

export function selectWorkspaceMember(
  workspaceId: WorkspaceMember['workspaceId'],
  userId: WorkspaceMember['userId'],
) {
  return databaseEffect({
    table: 'workspace-members',
    callback: 'selectWorkspaceMember',
    execute: async () => {
      const result = await db
        .select({ organizationId: workspaceMembers.organizationId, role: workspaceMembers.role })
        .from(workspaceMembers)
        .where(
          and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)),
        )
        .limit(1);

      return result.at(0);
    },
  });
}

export function insertWorkspaceMember(input: InsertWorkspaceMemberInput) {
  return databaseEffect({
    table: 'workspace-members',
    callback: 'insertWorkspaceMember',
    execute: async () => {
      const result = await db.insert(workspaceMembers).values(input).returning();
      const member = result.at(0);

      logger.success(`Inserted workspace member -> ${member?.id}`);

      return member;
    },
  });
}
