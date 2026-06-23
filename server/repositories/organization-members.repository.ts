import type {
  InsertOrganizationMemberInput,
  OrganizationMember,
} from '~/server/types/organization-member.ts';
import { and, eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { organizationMembers } from '~/server/database/schema.ts';
import { databaseEffect } from '~/server/utils/effects.ts';
import { logger } from '~/server/utils/logger.ts';

export function selectOrganizationMember(
  organizationId: OrganizationMember['organizationId'],
  userId: OrganizationMember['userId'],
) {
  return databaseEffect({
    table: 'organization-members',
    callback: 'selectOrganizationMember',
    execute: async () => {
      const result = await db
        .select({ role: organizationMembers.role })
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, organizationId),
            eq(organizationMembers.userId, userId),
          ),
        )
        .limit(1);

      return result.at(0);
    },
  });
}

export function insertOrganizationMember(input: InsertOrganizationMemberInput) {
  return databaseEffect({
    table: 'organization-members',
    callback: 'insertOrganizationMember',
    execute: async () => {
      const result = await db.insert(organizationMembers).values(input).returning();
      const member = result.at(0);

      logger.success(`Inserted organization member -> ${member?.id}`);

      return member;
    },
  });
}
