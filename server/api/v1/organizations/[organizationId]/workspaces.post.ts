import { Effect, Schema } from 'effect';
import { defineHandler } from 'nitro';
import { insertWorkspaceWithOwner } from '~/server/repositories/workspaces.repository.ts';
import { requireOrganizationAdmin } from '~/server/utils/authorization.ts';
import { failHttp, parseJsonBodyWithSchema } from '~/server/utils/effects.ts';

const bodySchema = Schema.Struct({
  name: Schema.String.pipe(Schema.minLength(1)),
  slug: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(100)),
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

    return yield* insertWorkspaceWithOwner(
      { ...body, organizationId, createdByUserId: userId },
      { organizationId, userId, role: 'owner' },
    );
  });

  return Effect.runPromise(program);
});
