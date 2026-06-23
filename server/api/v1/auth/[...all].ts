import { Effect } from 'effect';
import { HTTPError, defineHandler } from 'nitro';
import { auth } from '~/server/authentication/index.ts';

export default defineHandler(async (event) => {
  return Effect.runPromise(
    Effect.tryPromise({
      try: async () => auth.handler(event.req),
      catch: (error) =>
        error instanceof HTTPError
          ? error
          : new HTTPError({
              status: 500,
              statusText: 'Internal Server Error',
              message: error instanceof Error ? error.message : 'Authentication request failed',
            }),
    }),
  );
});
