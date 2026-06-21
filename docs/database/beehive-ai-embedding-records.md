# beehive.ai_embedding_records

## Purpose

Metadata table for stored embeddings. The actual vector is stored in a dimension-specific vector table.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `workspaceId`
- `userId`
- `chatId`
- `messageId`
- `modelId`
- `content`
- `model`
- `dimensions`
- `tokenCount`
- `metadata`

## Dependent Tables

organizations, workspaces, users, ai_chats, ai_messages, ai_models.

## Relations

Belongs to `aiModel`. Has one matching vector row in exactly one ai*embedding_vectors*\* table based on dimensions.

## Notes

Never search across mixed dimensions.
