# beehive.organization_invites

## Purpose

Stores pending or accepted invitations for users to join an organization.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `email`
- `role: role to grant on acceptance`
- `token: unique invite token`
- `expiresAt`
- `acceptedAt`
- `createdByUserId`
- `metadata`

## Dependent Tables

organizations, users.

## Relations

Belongs to one organization; optionally references the inviter user.
