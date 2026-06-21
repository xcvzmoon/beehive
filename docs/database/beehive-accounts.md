# beehive.accounts

## Purpose

Auth table for external or credential login accounts connected to a user. This is intended for Better Auth provider/account data, not app authorization roles.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `accountId: provider account identifier`
- `providerId: auth provider identifier`
- `userId: owning user`
- `accessToken / refreshToken / idToken: optional provider tokens`
- `accessTokenExpiresAt / refreshTokenExpiresAt`
- `scope`
- `password: optional credential auth value`

## Dependent Tables

users.

## Relations

Belongs to one user.

## Notes

Do not add organization/workspace roles here.
