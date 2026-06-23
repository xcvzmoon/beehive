import { Effect, Schema } from 'effect';
import { getOllamaBaseUrl } from '~/server/config/ai.ts';
import { AiConfigurationError, AiProviderError } from '~/server/errors/ai.ts';
import { updateAiModelFromCatalog } from '~/server/repositories/ai-models.repository.ts';
import { selectAiProviderByKeyAndEnabled } from '~/server/repositories/ai-providers.repository.ts';

const ollamaTagsResponseSchema = Schema.Struct({
  models: Schema.optionalWith(Schema.Array(Schema.Struct({ name: Schema.String })), {
    default: () => [],
  }),
});

export function syncOllamaModels() {
  return Effect.gen(function* syncOllamaModelsProgram() {
    const provider = yield* selectAiProviderByKeyAndEnabled('ollama');

    if (!provider) {
      return yield* Effect.fail(
        new AiConfigurationError({ message: 'AI_CONFIG_ERROR: MISSING_OLLAMA_PROVIDER' }),
      );
    }

    const response = yield* Effect.tryPromise({
      try: async () => fetch(`${getOllamaBaseUrl()}/api/tags`),
      catch: (error) =>
        new AiProviderError({
          provider: 'ollama',
          operation: 'models.sync',
          message: error instanceof Error ? error.message : 'Failed to fetch Ollama tags',
        }),
    });

    if (!response.ok) {
      return yield* Effect.fail(
        new AiProviderError({
          provider: 'ollama',
          operation: 'models.sync',
          message: `OLLAMA_MODEL_SYNC_ERROR: ${response.status}`,
          status: response.status,
        }),
      );
    }

    const body = yield* Effect.tryPromise({
      try: async () => response.json() as Promise<unknown>,
      catch: (error) =>
        new AiProviderError({
          provider: 'ollama',
          operation: 'models.sync',
          message: error instanceof Error ? error.message : 'Ollama tags response was invalid JSON',
          status: response.status,
        }),
    });
    const { models } = yield* Schema.decodeUnknown(ollamaTagsResponseSchema)(body).pipe(
      Effect.mapError(
        (error) =>
          new AiProviderError({
            provider: 'ollama',
            operation: 'models.sync',
            message: 'Ollama tags response failed validation',
            status: response.status,
            data: error,
          }),
      ),
    );

    yield* Effect.all(
      models.map(({ name }) =>
        updateAiModelFromCatalog({
          providerId: provider.id,
          name,
          displayName: name,
          kind: isEmbeddingModel(name) ? 'embedding' : 'chat',
          supportsStreaming: true,
          supportsTools: false,
          supportsVision: false,
          enabled: true,
        }),
      ),
    );

    return { modelCount: models.length };
  });
}

function isEmbeddingModel(name: string) {
  return name.includes('embed');
}
