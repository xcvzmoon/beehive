# beehive.users

## Purpose

Auth table for human users. This is the main identity record used by Better Auth and by Beehive tenant, admin, and AI activity records.

## Structure

- `id: primary user identifier`
- `createdAt / updatedAt / deletedAt: lifecycle timestamps`
- `name: display name`
- `email: unique login/contact email`
- `emailVerified: Better Auth email verification state`
- `image: optional profile image URL`

## Dependent Tables

Dependent tables include sessions, accounts, organization memberships, workspace memberships, platform operators, API keys, audit logs, AI records, and usage records.

## Relations

One user can have many accounts, sessions, organization memberships, workspace memberships, AI chats/messages, and usage events.

## Notes

Do not store tenant roles directly on users. Use organizationMembers, workspaceMembers, or platformOperators.
