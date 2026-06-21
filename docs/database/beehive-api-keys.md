# beehive.api_keys

## Purpose

Stores hashed server-to-server API keys for organization or workspace access.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `workspaceId: nullable for org-wide key`
- `createdByUserId`
- `name`
- `keyPrefix: safe display prefix`
- `keyHash: stored secret hash`
- `scopes`
- `lastUsedAt`
- `expiresAt`
- `revokedAt`
- `metadata`

## Dependent Tables

organizations, workspaces, users.

## Relations

Belongs to one organization; may belong to one workspace and creator user. Referenced by audit logs and AI usage events.

## Notes

Never store raw API keys.
