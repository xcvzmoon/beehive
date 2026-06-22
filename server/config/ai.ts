import { z } from 'zod';

const runtimeConfigSchema = z.object({
  ollamaBaseUrl: z.url().optional(),
});

export function getOllamaBaseUrl() {
  const { ollamaBaseUrl } = runtimeConfigSchema.parse({
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL,
  });

  if (!ollamaBaseUrl) {
    throw new Error('AI_CONFIG_ERROR: MISSING_OLLAMA_BASE_URL');
  }

  return ollamaBaseUrl.replace(/\/$/, '');
}
