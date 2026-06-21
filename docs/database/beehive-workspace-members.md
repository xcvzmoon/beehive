# beehive.workspace_members

## Purpose

Connects users to workspaces and stores workspace-level access.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `workspaceId`
- `userId`
- `role: default member`
- `metadata`

## Dependent Tables

workspaces, users.

## Relations

Belongs to one workspace and one user. Unique per workspace/user pair.
