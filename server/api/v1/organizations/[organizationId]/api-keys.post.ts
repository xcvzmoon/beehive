import { Effect, Schema } from 'effect';
import { defineHandler } from 'nitro';
import { generateApiKey } from '~/server/authentication/api-key.ts';
import { insertApiKey } from '~/server/repositories/api-keys.repository.ts';
import { insertAuditLog } from '~/server/repositories/audit-logs.repository.ts';
import {
  getWorkspaceOrganizationId,
  requireOrganizationAdmin,
} from '~/server/utils/authorization.ts';
import { failHttp, parseJsonBodyWithSchema } from '~/server/utils/effects.ts';

const scopeSchema = Schema.Literal('models:read', 'inference:responses', 'inference:embeddings');
const bodySchema = Schema.Struct({
  name: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(100)),
  workspaceId: Schema.UUID,
  scopes: Schema.Array(scopeSchema).pipe(Schema.minItems(1)),
  expiresAt: Schema.optional(Schema.DateFromString),
});

export default defineHandler(async (event) => {
  const organizationId = event.context.params?.organizationId;
  const userId = event.context.auth?.user.id;

  const program = Effect.gen(function* program() {
    if (!organizationId || !userId) {
      return yield* failHttp({
        status: 401,
        statusText: 'Unauthorized',
        message: 'A session is required',
      });
    }

    yield* requireOrganizationAdmin(organizationId, userId);
    const body = yield* parseJsonBodyWithSchema(event, bodySchema);
    const workspaceOrganizationId = yield* getWorkspaceOrganizationId(body.workspaceId);

    if (workspaceOrganizationId !== organizationId) {
      return yield* failHttp({
        status: 422,
        statusText: 'Unprocessable Content',
        message: 'The workspace does not belong to this organization',
      });
    }

    const { key, keyHash, keyPrefix } = generateApiKey();
    const apiKey = yield* insertApiKey({
      organizationId,
      workspaceId: body.workspaceId,
      createdByUserId: userId,
      name: body.name,
      keyPrefix,
      keyHash,
      scopes: body.scopes,
      expiresAt: body.expiresAt,
    });

    if (apiKey) {
      yield* insertAuditLog({
        organizationId,
        workspaceId: body.workspaceId,
        actorUserId: userId,
        apiKeyId: apiKey.id,
        action: 'api_key.created',
        targetType: 'api_key',
        targetId: apiKey.id,
        metadata: {
          name: body.name,
          keyPrefix,
          scopes: body.scopes,
          expiresAt: body.expiresAt?.toISOString(),
        },
      });
    }

    return { ...apiKey, key };
  });

  return Effect.runPromise(program);
});
