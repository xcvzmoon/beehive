# beehive.ai_usage_events

## Purpose

Raw metering table for AI operations. This is the source for analytics, limits, billing aggregation, and debugging.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `workspaceId`
- `userId`
- `apiKeyId`
- `chatId`
- `messageId`
- `providerId`
- `modelId`
- `operation`
- `inputTokens`
- `outputTokens`
- `totalTokens`
- `costMicros`
- `latencyMs`
- `metadata`

## Dependent Tables

organizations, workspaces, users, api_keys, ai_chats, ai_messages, ai_providers, ai_models.

## Relations

Belongs to one organization and may reference the workspace, user/API key, chat/message, provider, and model used.
