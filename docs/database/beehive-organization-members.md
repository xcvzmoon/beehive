# beehive.organization_members

## Purpose

Connects users to organizations and stores their organization-level role.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `userId`
- `role: default member`
- `metadata`

## Dependent Tables

organizations, users.

## Relations

Belongs to one organization and one user. Unique per organization/user pair.

## Notes

Do not store org roles on users.
