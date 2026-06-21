# beehive.ai_messages

## Purpose

Stores individual messages in an AI chat, including AI SDK-compatible structured parts.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `workspaceId`
- `createdByUserId`
- `chatId`
- `parentMessageId`
- `role`
- `status`
- `content`
- `parts`
- `model`
- `providerMessageId`
- `finishReason`
- `error`
- `inputTokens`
- `outputTokens`
- `totalTokens`
- `tokenCount`
- `metadata`

## Dependent Tables

organizations, workspaces, users, ai_chats.

## Relations

Belongs to one chat. Has many tool calls, embedding records, and usage events.

## Notes

Use content for readable/searchable text and parts for structured AI SDK payloads.
