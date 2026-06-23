import type { InsertOrganizationMemberInput } from '~/server/types/organization-member.ts';
import type { InsertOrganizationInput } from '~/server/types/organization.ts';
import { db } from '~/server/database/index.ts';
import { organizationMembers, organizations } from '~/server/database/schema.ts';
import { databaseEffect } from '~/server/utils/effects.ts';
import { logger } from '~/server/utils/logger.ts';

export function insertOrganization(input: InsertOrganizationInput) {
  return databaseEffect({
    table: 'organizations',
    callback: 'insertOrganization',
    execute: async () => {
      const result = await db.insert(organizations).values(input).returning();
      const organization = result.at(0);

      logger.success(`Inserted organization -> ${organization?.id}`);

      return organization;
    },
  });
}

export function insertOrganizationWithOwner(
  organization: InsertOrganizationInput,
  owner: Omit<InsertOrganizationMemberInput, 'organizationId'>,
) {
  return databaseEffect({
    table: 'organizations',
    callback: 'insertOrganizationWithOwner',
    execute: async () => {
      const createdOrganization = await db.transaction(async (tx) => {
        const result = await tx.insert(organizations).values(organization).returning();
        const insertedOrganization = result.at(0);

        if (!insertedOrganization) {
          throw new Error('Insert returned no organization');
        }

        await tx
          .insert(organizationMembers)
          .values({ ...owner, organizationId: insertedOrganization.id });

        return insertedOrganization;
      });

      logger.success(`Inserted organization with owner -> ${createdOrganization.id}`);

      return createdOrganization;
    },
  });
}
