# beehive.ai_models

## Purpose

Global catalog of provider models and their capabilities/cost metadata.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `providerId`
- `name`
- `displayName`
- `kind: chat, embedding, etc.`
- `contextWindow`
- `maxOutputTokens`
- `inputTokenCostMicros`
- `outputTokenCostMicros`
- `embeddingDimensions`
- `supportsStreaming`
- `supportsTools`
- `supportsVision`
- `enabled`
- `metadata`

## Dependent Tables

ai_providers.

## Relations

Belongs to one provider. Referenced by configurations, chats, embeddings, and usage events.
