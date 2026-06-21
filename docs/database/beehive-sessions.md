# beehive.sessions

## Purpose

Auth table for active user sessions managed by Better Auth.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `userId: session owner`
- `token: unique session token`
- `ipAddress`
- `userAgent`
- `expiresAt`

## Dependent Tables

users.

## Relations

Belongs to one user.
