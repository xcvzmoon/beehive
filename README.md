# Beehive

[![CI](https://github.com/xcvzmoon/beehive/actions/workflows/ci.yaml/badge.svg)](https://github.com/xcvzmoon/beehive/actions/workflows/ci.yaml)

Composable AI inference API built on Nitro

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
