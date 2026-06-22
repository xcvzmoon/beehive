import { HTTPError, defineHandler } from 'nitro';
import { findWorkspaceAiModels } from '~/server/repositories/ai-models.ts';

export default defineHandler(async (event) => {
  const apiKey = event.context.apiKey;

  if (!apiKey?.scopes.includes('models:read')) {
    throw new HTTPError({
      status: 403,
      statusText: 'Forbidden',
      message: 'The API key does not have the models:read scope',
    });
  }

  const models = await findWorkspaceAiModels(apiKey.workspaceId);

  return { data: models };
});
