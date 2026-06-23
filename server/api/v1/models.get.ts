import { Effect } from 'effect';
import { defineHandler } from 'nitro';
import { selectAiModelsInWorkspace } from '~/server/repositories/ai-models.repository.ts';
import { failHttp } from '~/server/utils/effects.ts';

export default defineHandler(async (event) => {
  const apiKey = event.context.apiKey;

  const program = Effect.gen(function* program() {
    if (!apiKey?.scopes.includes('models:read')) {
      return yield* failHttp({
        status: 403,
        statusText: 'Forbidden',
        message: 'The API key does not have the models:read scope',
      });
    }

    const models = yield* selectAiModelsInWorkspace(apiKey.workspaceId);

    return { data: models };
  });

  return Effect.runPromise(program);
});
