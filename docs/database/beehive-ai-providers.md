# beehive.ai_providers

## Purpose

Global catalog of supported AI providers such as OpenAI, Ollama, Anthropic, OpenRouter, or custom OpenAI-compatible providers.

## Structure

- `id`
- `createdAt / updatedAt / deletedAt`
- `key: unique provider key`
- `displayName`
- `type`
- `baseUrl`
- `enabled`
- `metadata`

## Dependent Tables

None.

## Relations

Has many AI models, credentials, configurations, chats, and usage events.
