# beehive.ai_tool_calls

## Purpose

Stores model-requested tool/function calls, their arguments, results, and execution status.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `workspaceId`
- `messageId`
- `providerToolCallId`
- `toolName`
- `arguments`
- `result`
- `status`
- `error`
- `metadata`

## Dependent Tables

organizations, workspaces, ai_messages.

## Relations

Belongs to one message.
