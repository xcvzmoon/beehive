import { Effect } from 'effect';
import { syncOllamaModels } from '~/server/utils/ai/models/sync-ollama-models.ts';

await Effect.runPromise(syncOllamaModels());
