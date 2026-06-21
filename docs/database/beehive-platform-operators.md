# beehive.platform_operators

## Purpose

Stores platform-level operator access for Beehive staff/admins. This is separate from tenant roles and is used for SaaS-wide admin/support access.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `userId: operator user`
- `role: platform role, default support`
- `scopes: optional granular permissions`
- `createdByUserId: user who granted access`
- `lastUsedAt`
- `disabledAt`
- `metadata`

## Dependent Tables

users.

## Relations

Belongs to one user; may reference the user who granted access.

## Notes

Expected roles are app-validated later, e.g. owner, admin, support, billing, readonly.
