import type { InsertOrganizationMemberInput } from '~/server/types/organization-member.ts';
import type { InsertOrganizationInput } from '~/server/types/organization.ts';
import { db } from '~/server/database/index.ts';
import { organizationMembers, organizations } from '~/server/database/schema.ts';

export async function insertOrganization(input: InsertOrganizationInput) {
  const [organization] = await db.insert(organizations).values(input).returning();
  return organization;
}

export async function createOrganizationWithOwner(
  organization: InsertOrganizationInput,
  owner: Omit<InsertOrganizationMemberInput, 'organizationId'>,
) {
  return db.transaction(async (tx) => {
    const [createdOrganization] = await tx.insert(organizations).values(organization).returning();
    await tx
      .insert(organizationMembers)
      .values({ ...owner, organizationId: createdOrganization.id });
    return createdOrganization;
  });
}
