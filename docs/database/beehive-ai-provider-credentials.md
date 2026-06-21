# beehive.ai_provider_credentials

## Purpose

Stores encrypted provider credentials scoped to an organization, workspace, or user. This supports org-wide keys, workspace keys, and personal credentials.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `workspaceId: nullable`
- `userId: nullable personal owner`
- `createdByUserId`
- `providerId`
- `label`
- `apiKeyEncrypted`
- `apiKeyIv`
- `apiKeyTag`
- `keyVersion`
- `enabled`
- `lastValidatedAt`
- `metadata`

## Dependent Tables

organizations, workspaces, users, ai_providers.

## Relations

Belongs to one organization and provider; may belong to a workspace and/or user. Referenced by AI configurations.

## Notes

Only encrypted API keys and encryption metadata are stored.
