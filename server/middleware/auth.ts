import { defineHandler, HTTPError } from 'nitro';
import { authenticateApiKey } from '~/server/authentication/api-key.ts';
import { auth } from '~/server/authentication/index.ts';

export default defineHandler(async (event) => {
  const { pathname } = event.url;
  const isApiV1Route = pathname.startsWith('/api/v1/');
  const isAuthRoute = pathname.startsWith('/api/v1/auth/');

  if (!isApiV1Route || isAuthRoute) {
    return;
  }

  if (isDataPlaneRoute(pathname)) {
    const apiKey = await authenticateApiKey(event);

    if (!apiKey) {
      throw new HTTPError({
        status: 401,
        statusText: 'Unauthorized',
        message: 'A valid API key is required to access this resource',
      });
    }

    event.context.apiKey = apiKey;
    return;
  }

  const session = await auth.api.getSession({ headers: event.req.headers });

  if (!session?.user) {
    throw new HTTPError({
      status: 401,
      statusText: 'Unauthorized',
      message: 'You must be signed in to access this resource',
    });
  }

  event.context.auth = session;
});

function isDataPlaneRoute(pathname: string) {
  return (
    pathname === '/api/v1/models' ||
    pathname === '/api/v1/responses' ||
    pathname === '/api/v1/embeddings'
  );
}
