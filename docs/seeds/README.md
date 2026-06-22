# Seeds

Run seeds only after the database schema is current. Seed commands load `.env` when it exists and require the normal database configuration used by the server.

## Order

1. Apply the current schema using the project's migration workflow.
2. Run `vpr db:seed:catalog` to create or refresh the provider catalog.
3. If Ollama is used, start Ollama and ensure `OLLAMA_BASE_URL` points to it.
4. Run `vpr db:sync:ollama-models` to synchronize locally installed Ollama models.
5. Create a workspace configuration that references one of the seeded provider/model pairs.

See the seed-specific documents for the data written by each command.

- [`catalog.md`](./catalog.md)
- [`sync-ollama-models.md`](./sync-ollama-models.md)
