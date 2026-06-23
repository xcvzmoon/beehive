import type { WorkspaceAiConfiguration } from '~/server/utils/ai/configuration.ts';
import { Effect } from 'effect';
import { HTTPError } from 'nitro';
import { getOllamaBaseUrl } from '~/server/config/ai.ts';
import { AiProviderError } from '~/server/errors/ai.ts';
import { failHttp } from '~/server/utils/effects.ts';

export function createOpenAiCompatibleResponse(
  configuration: WorkspaceAiConfiguration,
  input: Record<string, unknown>,
) {
  return Effect.gen(function* createOpenAiCompatibleResponseProgram() {
    const baseUrl = yield* getProviderBaseUrl(configuration);
    const response = yield* Effect.tryPromise({
      try: async () =>
        fetch(`${baseUrl}/responses`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...input,
            model: configuration.modelName,
            instructions: configuration.systemPrompt ?? undefined,
            temperature: configuration.temperature ?? undefined,
            top_p: configuration.topP ?? undefined,
            max_output_tokens: configuration.maxOutputTokens ?? undefined,
          }),
        }),
      catch: (error) =>
        new AiProviderError({
          provider: configuration.providerKey,
          operation: 'responses.create',
          message: error instanceof Error ? error.message : 'Provider request failed',
        }),
    });

    const body = yield* Effect.tryPromise({
      try: async () => response.json() as Promise<unknown>,
      catch: (error) =>
        new AiProviderError({
          provider: configuration.providerKey,
          operation: 'responses.create',
          message: error instanceof Error ? error.message : 'Provider response was invalid JSON',
          status: response.status,
        }),
    });

    if (!response.ok) {
      return yield* Effect.fail(
        new HTTPError({
          status: 502,
          statusText: 'Bad Gateway',
          message: `The ${configuration.providerKey} provider returned ${response.status}`,
          data: body,
        }),
      );
    }

    return body;
  });
}

function getProviderBaseUrl(configuration: WorkspaceAiConfiguration) {
  return Effect.gen(function* getProviderBaseUrlProgram() {
    if (configuration.providerKey === 'ollama') {
      return `${getOllamaBaseUrl()}/v1`;
    }

    if (configuration.providerType === 'openai-compatible' && configuration.providerBaseUrl) {
      return configuration.providerBaseUrl;
    }

    return yield* failHttp({
      status: 501,
      statusText: 'Not Implemented',
      message: `The ${configuration.providerKey} provider is not configured for responses`,
    });
  });
}
