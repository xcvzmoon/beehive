import { Effect, Schema } from 'effect';
import { defineHandler } from 'nitro';
import { insertAiConfigurationDefault } from '~/server/repositories/ai-configurations.repository.ts';
import {
  selectAiModelByKeyAndName,
  selectAiModelByProviderIdAndName,
} from '~/server/repositories/ai-models.repository.ts';
import { requireWorkspaceOwner } from '~/server/utils/authorization.ts';
import { failHttp, parseJsonBodyWithSchema } from '~/server/utils/effects.ts';

const bodySchema = Schema.Struct({
  providerKey: Schema.String.pipe(Schema.minLength(1)),
  modelName: Schema.String.pipe(Schema.minLength(1)),
  embeddingModelName: Schema.optional(Schema.String.pipe(Schema.minLength(1))),
  name: Schema.optionalWith(Schema.String.pipe(Schema.minLength(1)), { default: () => 'default' }),
  systemPrompt: Schema.optional(Schema.String),
  temperature: Schema.optional(
    Schema.Number.pipe(Schema.greaterThanOrEqualTo(0), Schema.lessThanOrEqualTo(2)),
  ),
  maxOutputTokens: Schema.optional(Schema.Number.pipe(Schema.int(), Schema.positive())),
});

export default defineHandler(async (event) => {
  const workspaceId = event.context.params?.workspaceId;
  const userId = event.context.auth?.user.id;

  const program = Effect.gen(function* program() {
    if (!workspaceId || !userId) {
      return yield* failHttp({
        status: 401,
        statusText: 'Unauthorized',
        message: 'A session is required',
      });
    }

    const organizationId = yield* requireWorkspaceOwner(workspaceId, userId);
    const body = yield* parseJsonBodyWithSchema(event, bodySchema);
    const model = yield* selectAiModelByKeyAndName(body.providerKey, body.modelName);

    if (!model) {
      return yield* failHttp({
        status: 404,
        statusText: 'Not Found',
        message: 'Provider model was not found',
      });
    }

    const embeddingModel = body.embeddingModelName
      ? yield* selectAiModelByProviderIdAndName(model.providerId, body.embeddingModelName)
      : undefined;

    if (body.embeddingModelName && !embeddingModel) {
      return yield* failHttp({
        status: 404,
        statusText: 'Not Found',
        message: 'Embedding model was not found',
      });
    }

    return yield* insertAiConfigurationDefault({
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

  return Effect.runPromise(program);
});
