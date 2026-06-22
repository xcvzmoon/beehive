import type { H3Event } from 'h3';
import { HTTPError, defineHandler } from 'nitro';
import { getDefaultWorkspaceAiConfiguration } from '~/server/utils/ai/configuration.ts';
import { persistResponse } from '~/server/utils/ai/persist-response.ts';
import { createOpenAiCompatibleResponse } from '~/server/utils/ai/providers/openai-compatible.ts';

export default defineHandler(async (event) => {
  const apiKey = event.context.apiKey;

  if (!apiKey?.scopes.includes('inference:responses')) {
    throw new HTTPError({
      status: 403,
      statusText: 'Forbidden',
      message: 'The API key does not have the inference:responses scope',
    });
  }

  const input = await getRequestObject(event);

  if (input.stream === true) {
    throw new HTTPError({
      status: 501,
      statusText: 'Not Implemented',
      message: 'Streaming responses are not implemented yet',
    });
  }

  const configuration = await getDefaultWorkspaceAiConfiguration(apiKey.workspaceId);
  const response = await createOpenAiCompatibleResponse(configuration, input);
  await persistResponse(configuration, apiKey.apiKeyId, input, response);
  return response;
});

async function getRequestObject(event: H3Event) {
  const body: unknown = await event.req.json();

  if (!isRecord(body)) {
    throw new HTTPError({
      status: 400,
      statusText: 'Bad Request',
      message: 'The request body must be a JSON object',
    });
  }

  return body;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
