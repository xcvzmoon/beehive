# Beehive

[![CI](https://github.com/xcvzmoon/beehive/actions/workflows/ci.yaml/badge.svg)](https://github.com/xcvzmoon/beehive/actions/workflows/ci.yaml)

Composable AI inference API built on Nitro

## AI API

Route reference, request flow, and cURL examples are documented in [`docs/ai/README.md`](./docs/ai/README.md).

### Run seeds

Run the seeds in this order after applying the current database schema:

1. `vpr db:seed:catalog`
2. Start Ollama and configure `OLLAMA_BASE_URL` if Ollama is used.
3. `vpr db:sync:ollama-models`

Detailed seed purpose and contents are in [`docs/seeds/README.md`](./docs/seeds/README.md).

### Consume AI routes

1. Sign in and keep the session cookie.
2. Create an organization, then a workspace.
3. Configure that workspace with a seeded provider and model.
4. Create an API key scoped for `models:read` and/or `inference:responses`.
5. Call `GET /api/v1/models` or `POST /api/v1/responses` with `Authorization: Bearer <api-key>`.

See the [AI API usage example](./docs/ai/README.md#usage-example) for complete requests.

## Authentication Documentation

For authentication endpoints, enabled flows, Redis-backed storage, and email-template setup, see:

- [`docs/authentication/README.md`](./docs/authentication/README.md)

## Mailer Documentation

For SMTP configuration, rendering, retries, deduplication, and circuit-breaker behavior, see:

- [`docs/mailer/README.md`](./docs/mailer/README.md)

## Database Documentation

For questions about the database schema, tables, relationships, or how each table should be used, see the database docs:

- [`docs/database/README.md`](./docs/database/README.md)

The database docs include table-by-table references for auth tables, tenancy, billing, platform admin, AI providers/configuration, chats, usage events, and embeddings.

### Embedding Storage Note

Embeddings are stored as metadata records plus dimension-specific embedding tables, such as `ai_embedding_vectors_768` and `ai_embedding_vectors_1536`. This is intentional: PostgreSQL `pgvector` indexes work best with fixed dimensions, and different embedding models/providers can output different dimensions. Splitting embeddings by dimension keeps similarity search correct, indexable, and scalable while still allowing new dimensions to be added later. The 3072-dimension table uses `halfvec` so it can be indexed with HNSW; pgvector's `vector` HNSW indexes are limited to 2000 dimensions.
