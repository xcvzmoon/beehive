# beehive.audit_logs

## Purpose

Immutable-style activity log for security, admin, and compliance events.

## Structure

- `id`
- `createdAt`
- `organizationId`
- `workspaceId`
- `actorUserId`
- `apiKeyId`
- `action`
- `targetType`
- `targetId`
- `metadata`

## Dependent Tables

organizations, workspaces, users, api_keys.

## Relations

Can reference the tenant, workspace, user, and API key involved in an action.

## Notes

Use for events like `api_key.created`, `api_key.revoked`, `ai.config.updated`, `chat.deleted`, and `billing.changed`. API key creation and revocation currently write audit records with the actor, organization, workspace, target API key, and relevant metadata.
