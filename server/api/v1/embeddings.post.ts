import { Effect } from 'effect';
import { defineHandler } from 'nitro';
import { failHttp } from '~/server/utils/effects.ts';

export default defineHandler(async (event) => {
  const apiKey = event.context.apiKey;

  return Effect.runPromise(
    Effect.gen(function* embeddingsProgram() {
      if (!apiKey?.scopes.includes('inference:embeddings')) {
        return yield* failHttp({
          status: 403,
          statusText: 'Forbidden',
          message: 'The API key does not have the inference:embeddings scope',
        });
      }

      return yield* failHttp({
        status: 501,
        statusText: 'Not Implemented',
        message: 'Configure an embedding model for the workspace before using embeddings',
      });
    }),
  );
});
