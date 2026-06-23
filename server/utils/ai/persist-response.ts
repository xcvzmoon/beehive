import type { WorkspaceAiConfiguration } from '~/server/utils/ai/configuration.ts';
import { Effect } from 'effect';
import { insertAiChatWithMessagesAndUsage } from '~/server/repositories/ai-chats.repository.ts';

export function persistResponse(
  configuration: WorkspaceAiConfiguration,
  apiKeyId: string,
  input: Record<string, unknown>,
  response: unknown,
) {
  return Effect.gen(function* persistResponseProgram() {
    const output = getOutputText(response);
    const usage = getUsage(response);

    yield* insertAiChatWithMessagesAndUsage(
      {
        organizationId: configuration.organizationId,
        workspaceId: configuration.workspaceId,
        configurationId: configuration.configurationId,
        providerId: configuration.providerId,
        modelId: configuration.modelId,
        provider: configuration.providerKey,
        model: configuration.modelName,
      },
      [
        {
          organizationId: configuration.organizationId,
          workspaceId: configuration.workspaceId,
          role: 'user',
          content: JSON.stringify(input),
        },
        {
          organizationId: configuration.organizationId,
          workspaceId: configuration.workspaceId,
          role: 'assistant',
          content: output,
          parts: isRecord(response) ? response : null,
        },
      ],
      {
        organizationId: configuration.organizationId,
        workspaceId: configuration.workspaceId,
        apiKeyId,
        providerId: configuration.providerId,
        modelId: configuration.modelId,
        operation: 'responses.create',
        ...usage,
      },
    );
  });
}

function getOutputText(value: unknown) {
  if (!isRecord(value) || !isUnknownArray(value.output)) return '';

  return value.output
    .flatMap((item) => (isRecord(item) && isUnknownArray(item.content) ? item.content : []))
    .flatMap((part) => (isRecord(part) && typeof part.text === 'string' ? [part.text] : []))
    .join('');
}

function getUsage(value: unknown) {
  if (!isRecord(value) || !isRecord(value.usage)) {
    return {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    };
  }

  return {
    inputTokens: number(value.usage.input_tokens),
    outputTokens: number(value.usage.output_tokens),
    totalTokens: number(value.usage.total_tokens),
  };
}

function number(value: unknown) {
  return typeof value === 'number' ? value : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
