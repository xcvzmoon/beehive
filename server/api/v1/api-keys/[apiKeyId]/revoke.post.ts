import { Effect } from 'effect';
import { defineHandler } from 'nitro';
import { selectApiKeyById, updateApiKey } from '~/server/repositories/api-keys.repository.ts';
import { insertAuditLog } from '~/server/repositories/audit-logs.repository.ts';
import { requireOrganizationAdmin } from '~/server/utils/authorization.ts';
import { failHttp } from '~/server/utils/effects.ts';

export default defineHandler(async (event) => {
  const apiKeyId = event.context.params?.apiKeyId;
  const userId = event.context.auth?.user.id;

  const program = Effect.gen(function* program() {
    if (!apiKeyId || !userId) {
      return yield* failHttp({
        status: 401,
        statusText: 'Unauthorized',
        message: 'A session is required',
      });
    }

    const apiKey = yield* selectApiKeyById(apiKeyId);

    if (!apiKey) {
      return yield* failHttp({
        status: 404,
        statusText: 'Not Found',
        message: 'API key was not found',
      });
    }

    yield* requireOrganizationAdmin(apiKey.organizationId, userId);

    const revokedApiKey = yield* updateApiKey(apiKeyId, {
      revokedAt: apiKey.revokedAt ?? new Date(),
    });

    yield* insertAuditLog({
      organizationId: apiKey.organizationId,
      workspaceId: apiKey.workspaceId,
      actorUserId: userId,
      apiKeyId,
      action: 'api_key.revoked',
      targetType: 'api_key',
      targetId: apiKeyId,
      metadata: { alreadyRevoked: Boolean(apiKey.revokedAt) },
    });

    return revokedApiKey;
  });

  return Effect.runPromise(program);
});
