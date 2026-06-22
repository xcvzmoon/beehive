import { z } from 'zod';
import { getOllamaBaseUrl } from '~/server/config/ai.ts';
import { updateAiModelFromCatalog } from '~/server/repositories/ai-models.ts';
import { findEnabledAiProviderByKey } from '~/server/repositories/ai-providers.ts';

const ollamaTagsResponseSchema = z.object({
  models: z.array(z.object({ name: z.string() })).default([]),
});

export async function syncOllamaModels() {
  const provider = await findEnabledAiProviderByKey('ollama');

  if (!provider) {
    throw new Error('AI_CONFIG_ERROR: MISSING_OLLAMA_PROVIDER');
  }

  const response = await fetch(`${getOllamaBaseUrl()}/api/tags`);

  if (!response.ok) {
    throw new Error(`OLLAMA_MODEL_SYNC_ERROR: ${response.status}`);
  }

  const body: unknown = await response.json();
  const { models } = ollamaTagsResponseSchema.parse(body);

  await Promise.all(
    models.map(async ({ name }) => {
      await updateAiModelFromCatalog({
        providerId: provider.id,
        name,
        displayName: name,
        kind: isEmbeddingModel(name) ? 'embedding' : 'chat',
        supportsStreaming: true,
        supportsTools: false,
        supportsVision: false,
        enabled: true,
      });
    }),
  );

  return { modelCount: models.length };
}

function isEmbeddingModel(name: string) {
  return name.includes('embed');
}
