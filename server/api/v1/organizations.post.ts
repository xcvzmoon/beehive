import { Effect, Schema } from 'effect';
import { defineHandler } from 'nitro';
import { insertOrganizationWithOwner } from '~/server/repositories/organizations.repository.ts';
import { failHttp, parseJsonBodyWithSchema } from '~/server/utils/effects.ts';

const bodySchema = Schema.Struct({
  name: Schema.String.pipe(Schema.minLength(1)),
  slug: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(100)),
});

export default defineHandler(async (event) => {
  const userId = event.context.auth?.user.id;

  const program = Effect.gen(function* program() {
    if (!userId) {
      return yield* failHttp({
        status: 401,
        statusText: 'Unauthorized',
        message: 'A session is required',
      });
    }

    const body = yield* parseJsonBodyWithSchema(event, bodySchema);

    return yield* insertOrganizationWithOwner(
      { ...body, createdByUserId: userId },
      { userId, role: 'owner' },
    );
  });

  return Effect.runPromise(program);
});
