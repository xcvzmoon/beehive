import { defineHandler, HTTPError } from 'nitro';
import { z } from 'zod';
import { createDefaultAiConfiguration } from '~/server/repositories/ai-configurations.ts';
import {
  findAiModelByProviderAndName,
  findAiModelByProviderIdAndName,
} from '~/server/repositories/ai-models.ts';
import { requireWorkspaceOwner } from '~/server/utils/authorization.ts';

const bodySchema = z.object({
  providerKey: z.string().min(1),
  modelName: z.string().min(1),
  embeddingModelName: z.string().min(1).optional(),
  name: z.string().min(1).default('default'),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxOutputTokens: z.number().int().positive().optional(),
});

export default defineHandler(async (event) => {
  const workspaceId = event.context.params?.workspaceId;
  const userId = event.context.auth?.user.id;

  if (!workspaceId || !userId) {
    throw new HTTPError({
      status: 401,
      statusText: 'Unauthorized',
      message: 'A session is required',
    });
  }

  const organizationId = await requireWorkspaceOwner(workspaceId, userId);
  const body = bodySchema.parse(await event.req.json());
  const model = await findAiModelByProviderAndName(body.providerKey, body.modelName);

  if (!model) {
    throw new HTTPError({
      status: 404,
      statusText: 'Not Found',
      message: 'Provider model was not found',
    });
  }

  const embeddingModel = body.embeddingModelName
    ? await findAiModelByProviderIdAndName(model.providerId, body.embeddingModelName)
    : undefined;

  if (body.embeddingModelName && !embeddingModel) {
    throw new HTTPError({
      status: 404,
      statusText: 'Not Found',
      message: 'Embedding model was not found',
    });
  }

  return createDefaultAiConfiguration({
    organizationId,
    workspaceId,
    createdByUserId: userId,
    providerId: model.providerId,
    modelId: model.id,
    embeddingModelId: embeddingModel?.id,
    name: body.name,
    isDefault: true,
    systemPrompt: body.systemPrompt,
    temperature: body.temperature,
    maxOutputTokens: body.maxOutputTokens,
  });
});
