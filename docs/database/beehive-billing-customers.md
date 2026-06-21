# beehive.billing_customers

## Purpose

Maps an organization to an external billing provider customer, such as Stripe or Polar.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `provider`
- `providerCustomerId`
- `email`
- `metadata`

## Dependent Tables

organizations.

## Relations

Belongs to one organization and has many subscriptions.
