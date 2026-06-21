# beehive.ai_embedding_vectors_3072

## Purpose

Stores pgvector half-precision embeddings with exactly 3072 dimensions. This table is used only for embedding records whose dimensions value is 3072.

## Structure

- `recordId: primary key and reference to ai_embedding_records`
- `embedding: halfvec column`

## Dependent Tables

ai_embedding_records.

## Relations

Belongs to one embedding record. The migration adds an HNSW cosine halfvec index for similarity search. This table uses `halfvec` because pgvector HNSW indexes support `vector` only up to 2000 dimensions.

## Notes

Use this table only when the embedding array length matches this dimension.
