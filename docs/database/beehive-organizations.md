# beehive.organizations

## Purpose

Represents a tenant/customer account. Billing, workspaces, API keys, credentials, and usage are primarily scoped to organizations.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `name`
- `slug: unique organization URL/key`
- `image`
- `createdByUserId`
- `metadata`

## Dependent Tables

users.

## Relations

Has many members, invites, workspaces, API keys, billing customers, subscriptions, audit logs, and AI records.
