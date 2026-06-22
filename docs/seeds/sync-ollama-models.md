# Ollama model synchronization seed

## Description

`vpr db:sync:ollama-models` runs `server/database/seed/sync-ollama-models.ts`, which calls the configured Ollama instance's `/api/tags` endpoint.

## Purpose

It makes locally installed Ollama models selectable in workspace AI configurations. Run it after the provider catalog seed and whenever models are pulled, removed, or updated in Ollama.

## Contents

For every installed Ollama model, the seed upserts an AI model under the enabled `ollama` provider. It records the model name and display name, classifies embedding models, enables streaming metadata, and marks the model enabled.
