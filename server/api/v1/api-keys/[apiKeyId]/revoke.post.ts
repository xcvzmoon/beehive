import { defineHandler, HTTPError } from 'nitro';
import { findApiKeyById, updateApiKey } from '~/server/repositories/api-keys.ts';
import { requireOrganizationAdmin } from '~/server/utils/authorization.ts';

export default defineHandler(async (event) => {
  const apiKeyId = event.context.params?.apiKeyId;
  const userId = event.context.auth?.user.id;

  if (!apiKeyId || !userId) {
    throw new HTTPError({
      status: 401,
      statusText: 'Unauthorized',
      message: 'A session is required',
    });
  }

  const apiKey = await findApiKeyById(apiKeyId);

  if (!apiKey) {
    throw new HTTPError({
      status: 404,
      statusText: 'Not Found',
      message: 'API key was not found',
    });
  }

  await requireOrganizationAdmin(apiKey.organizationId, userId);

  const revokedApiKey = await updateApiKey(apiKeyId, { revokedAt: apiKey.revokedAt ?? new Date() });

  return revokedApiKey;
});
