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

Use for events like api_key.created, ai.config.updated, chat.deleted, billing.changed.
