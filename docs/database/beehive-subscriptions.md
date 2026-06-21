# beehive.subscriptions

## Purpose

Stores subscription state for an organization from an external billing provider.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `billingCustomerId`
- `providerSubscriptionId`
- `status`
- `plan`
- `currentPeriodStart`
- `currentPeriodEnd`
- `cancelAtPeriodEnd`
- `metadata`

## Dependent Tables

organizations, billing_customers.

## Relations

Belongs to one organization and optionally one billing customer.
