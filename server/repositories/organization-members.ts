import type { InsertOrganizationMemberInput } from '~/server/types/organization-member.ts';
import { and, eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { organizationMembers } from '~/server/database/schema.ts';

export async function findOrganizationMember(organizationId: string, userId: string) {
  const [member] = await db
    .select({ role: organizationMembers.role })
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId),
      ),
    )
    .limit(1);
  return member;
}

export async function insertOrganizationMember(input: InsertOrganizationMemberInput) {
  const [member] = await db.insert(organizationMembers).values(input).returning();
  return member;
}
