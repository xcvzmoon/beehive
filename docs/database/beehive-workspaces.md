# beehive.workspaces

## Purpose

Represents a project/team space inside an organization. AI configurations, chats, embeddings, and most operational data are workspace-scoped.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `name`
- `slug`
- `createdByUserId`
- `metadata`

## Dependent Tables

organizations, users.

## Relations

Belongs to one organization. Has many workspace members, API keys, AI configurations, chats, messages, embeddings, and usage events.
