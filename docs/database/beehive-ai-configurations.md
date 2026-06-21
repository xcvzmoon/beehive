# beehive.ai_configurations

## Purpose

Workspace-level saved AI configuration used to start chats or perform inference with consistent settings.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `organizationId`
- `workspaceId`
- `createdByUserId`
- `providerId`
- `modelId`
- `credentialId`
- `embeddingModelId`
- `name`
- `isDefault`
- `baseUrlOverride`
- `systemPrompt`
- `temperature`
- `topP`
- `maxOutputTokens`
- `metadata`

## Dependent Tables

organizations, workspaces, users, ai_providers, ai_models, ai_provider_credentials.

## Relations

Belongs to one workspace and references provider/model/credential choices. Has many chats.

## Notes

isDefault is not yet DB-constrained to one per workspace; enforce later in app logic or partial unique index.
