import { Effect } from 'effect';
import { defineHandler, HTTPError } from 'nitro';
import { authenticateApiKey } from '~/server/authentication/api-key.ts';
import { auth } from '~/server/authentication/index.ts';
import { failHttp } from '~/server/utils/effects.ts';

export default defineHandler(async (event) => {
  const program = Effect.gen(function* authMiddlewareProgram() {
    const { pathname } = event.url;
    const isApiV1Route = pathname.startsWith('/api/v1/');
    const isAuthRoute = pathname.startsWith('/api/v1/auth/');

    if (!isApiV1Route || isAuthRoute) {
      return;
    }

    if (isDataPlaneRoute(pathname)) {
      const apiKey = yield* authenticateApiKey(event);

      if (!apiKey) {
        yield* failHttp({
          status: 401,
          statusText: 'Unauthorized',
          message: 'A valid API key is required to access this resource',
        });
        return;
      }

      event.context.apiKey = apiKey;
      return;
    }

    const session = yield* Effect.tryPromise({
      try: async () => auth.api.getSession({ headers: event.req.headers }),
      catch: (error) =>
        new HTTPError({
          status: 500,
          statusText: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Failed to read the session',
        }),
    });

    if (!session?.user) {
      yield* failHttp({
        status: 401,
        statusText: 'Unauthorized',
        message: 'You must be signed in to access this resource',
      });
      return;
    }

    event.context.auth = session;
  });

  return Effect.runPromise(program);
});

function isDataPlaneRoute(pathname: string) {
  return (
    pathname === '/api/v1/models' ||
    pathname === '/api/v1/responses' ||
    pathname === '/api/v1/embeddings'
  );
}
