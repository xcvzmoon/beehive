import { HTTPError, defineHandler } from 'nitro';

export default defineHandler(async (event) => {
  const apiKey = event.context.apiKey;

  if (!apiKey?.scopes.includes('inference:embeddings')) {
    throw new HTTPError({
      status: 403,
      statusText: 'Forbidden',
      message: 'The API key does not have the inference:embeddings scope',
    });
  }

  throw new HTTPError({
    status: 501,
    statusText: 'Not Implemented',
    message: 'Configure an embedding model for the workspace before using embeddings',
  });
});
