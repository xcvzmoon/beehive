# Provider catalog seed

## Description

`vpr db:seed:catalog` runs `server/database/seed/catalog.ts` and upserts the supported provider catalog.

## Purpose

It establishes the provider records required before a workspace can select an AI configuration. It is safe to re-run: existing records are updated by provider key.

## Contents

The seed creates or refreshes enabled records for Ollama, OpenAI, Anthropic, Google Vertex AI, Azure OpenAI, OpenRouter, and a generic OpenAI-compatible provider. Each record includes its provider key, display name, provider type, base URL when applicable, and deployment-mode metadata.
