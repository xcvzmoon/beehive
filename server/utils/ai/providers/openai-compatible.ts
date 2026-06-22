import type { WorkspaceAiConfiguration } from '~/server/utils/ai/configuration.ts';
import { HTTPError } from 'nitro';
import { getOllamaBaseUrl } from '~/server/config/ai.ts';

export async function createOpenAiCompatibleResponse(
  configuration: WorkspaceAiConfiguration,
  input: Record<string, unknown>,
): Promise<unknown> {
  const baseUrl = getProviderBaseUrl(configuration);
  const response = await fetch(`${baseUrl}/responses`, {
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
  });

  const body: unknown = await response.json().catch((): unknown => null);

  if (!response.ok) {
    throw new HTTPError({
      status: 502,
      statusText: 'Bad Gateway',
      message: `The ${configuration.providerKey} provider returned ${response.status}`,
      data: body,
    });
  }

  return body;
}

function getProviderBaseUrl(configuration: WorkspaceAiConfiguration) {
  if (configuration.providerKey === 'ollama') {
    return `${getOllamaBaseUrl()}/v1`;
  }

  if (configuration.providerType === 'openai-compatible' && configuration.providerBaseUrl) {
    return configuration.providerBaseUrl;
  }

  throw new HTTPError({
    status: 501,
    statusText: 'Not Implemented',
    message: `The ${configuration.providerKey} provider is not configured for responses`,
  });
}
