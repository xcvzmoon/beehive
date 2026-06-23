import type { InsertAiProviderInput } from '~/server/types/ai-provider.ts';
import { Effect } from 'effect';
import { insertAiProvider } from '~/server/repositories/ai-providers.repository.ts';

const providers = [
  {
    key: 'ollama',
    displayName: 'Ollama',
    type: 'openai-compatible',
    baseUrl: null,
    enabled: true,
    metadata: { deploymentMode: 'local-or-managed' },
  },
  {
    key: 'openai',
    displayName: 'OpenAI',
    type: 'openai-compatible',
    baseUrl: 'https://api.openai.com/v1',
    enabled: true,
    metadata: { deploymentMode: 'managed' },
  },
  {
    key: 'anthropic',
    displayName: 'Anthropic',
    type: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    enabled: true,
    metadata: { deploymentMode: 'managed' },
  },
  {
    key: 'google-vertex-ai',
    displayName: 'Google Vertex AI',
    type: 'google-vertex-ai',
    baseUrl: null,
    enabled: true,
    metadata: { deploymentMode: 'managed' },
  },
  {
    key: 'azure-openai',
    displayName: 'Azure OpenAI',
    type: 'azure-openai',
    baseUrl: null,
    enabled: true,
    metadata: { deploymentMode: 'managed-or-customer-hosted' },
  },
  {
    key: 'openrouter',
    displayName: 'OpenRouter',
    type: 'openai-compatible',
    baseUrl: 'https://openrouter.ai/api/v1',
    enabled: true,
    metadata: { deploymentMode: 'managed' },
  },
  {
    key: 'openai-compatible',
    displayName: 'OpenAI-compatible',
    type: 'openai-compatible',
    baseUrl: null,
    enabled: true,
    metadata: { deploymentMode: 'self-hosted' },
  },
] satisfies InsertAiProviderInput[];

await Effect.runPromise(Effect.all(providers.map((provider) => insertAiProvider(provider))));
