# beehive.ai_chats

## Purpose

Represents a chat conversation in a workspace. It stores both references and provider/model snapshots so old chats remain understandable after config changes.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `workspaceId`
- `createdByUserId`
- `configurationId`
- `providerId`
- `modelId`
- `title`
- `status`
- `provider: snapshot`
- `model: snapshot`
- `systemPrompt`
- `temperature`
- `topP`
- `maxOutputTokens`
- `inputTokens`
- `outputTokens`
- `totalTokens`
- `lastMessageAt`
- `metadata`

## Dependent Tables

organizations, workspaces, users, ai_configurations, ai_providers, ai_models.

## Relations

Has many messages, embedding records, and usage events.
