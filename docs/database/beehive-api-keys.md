# beehive.api_keys

## Purpose

Stores server-to-server API keys for workspace-scoped access. Plaintext keys are returned only at creation time and are never stored.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `workspaceId`
- `createdByUserId`
- `name`
- `keyPrefix: safe display and lookup prefix, for example `bh*live_v1*<publicId>``
- `keyHash: HMAC-SHA256 hash of the full plaintext key using `API_KEY_PEPPER``
- `scopes`
- `lastUsedAt`
- `expiresAt`
- `revokedAt`
- `metadata`

## Dependent Tables

organizations, workspaces, users.

## Relations

Belongs to one organization, one workspace, and optionally one creator user. Referenced by audit logs and AI usage events.

## Notes

Never store raw API keys. API keys use the format `bh_<live|test>_v1_<publicId>_<secret>`. The prefix is unique and safe to display; the secret portion must be treated like a password. Successful authentication updates `lastUsedAt`; revocation sets `revokedAt`.
