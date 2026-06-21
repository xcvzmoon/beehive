# beehive.ai_embedding_vectors_1024

## Purpose

Stores pgvector embeddings with exactly 1024 dimensions. This table is used only for embedding records whose dimensions value is 1024.

## Structure

- `recordId: primary key and reference to ai_embedding_records`
- `embedding: vector column`

## Dependent Tables

ai_embedding_records.

## Relations

Belongs to one embedding record. The migration adds an HNSW cosine vector index for similarity search.

## Notes

Use this table only when the embedding array length matches this dimension.
