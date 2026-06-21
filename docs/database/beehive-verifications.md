# beehive.verifications

## Purpose

Auth table for verification challenges such as email verification, password reset, or one-time tokens used by Better Auth.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `identifier: user/email/process identifier`
- `value: verification token or value`
- `expiresAt`

## Dependent Tables

None.

## Relations

No direct foreign keys.
