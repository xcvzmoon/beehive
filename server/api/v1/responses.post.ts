import type { H3Event } from 'nitro';
import { Effect } from 'effect';
import { defineHandler } from 'nitro';
import { getDefaultWorkspaceAiConfiguration } from '~/server/utils/ai/configuration.ts';
import { persistResponse } from '~/server/utils/ai/persist-response.ts';
import { createOpenAiCompatibleResponse } from '~/server/utils/ai/providers/openai-compatible.ts';
import { failHttp, readJsonBody } from '~/server/utils/effects.ts';

export default defineHandler(async (event) => {
  const apiKey = event.context.apiKey;

  const program = Effect.gen(function* program() {
    if (!apiKey?.scopes.includes('inference:responses')) {
      return yield* failHttp({
        status: 403,
        statusText: 'Forbidden',
        message: 'The API key does not have the inference:responses scope',
      });
    }

    const input = yield* getRequestObject(event);

    if (input.stream === true) {
      return yield* failHttp({
        status: 501,
        statusText: 'Not Implemented',
        message: 'Streaming responses are not implemented yet',
      });
    }

    const configuration = yield* getDefaultWorkspaceAiConfiguration(apiKey.workspaceId);
    const response = yield* createOpenAiCompatibleResponse(configuration, input);

    yield* persistResponse(configuration, apiKey.apiKeyId, input, response);

    return response;
  });

  return Effect.runPromise(program);
});

function getRequestObject(event: H3Event) {
  return Effect.gen(function* getRequestObjectProgram() {
    const body: unknown = yield* readJsonBody(event);

    if (!isRecord(body)) {
      return yield* failHttp({
        status: 400,
        statusText: 'Bad Request',
        message: 'The request body must be a JSON object',
      });
    }

    return body;
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
