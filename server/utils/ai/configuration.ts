import { HTTPError } from 'nitro';
import { findDefaultWorkspaceAiConfiguration } from '~/server/repositories/ai-configurations.ts';

export type WorkspaceAiConfiguration = {
  configurationId: string;
  organizationId: string;
  workspaceId: string;
  providerId: string;
  modelId: string;
  providerKey: string;
  providerType: string;
  providerBaseUrl: string | null;
  modelName: string;
  systemPrompt: string | null;
  temperature: number | null;
  topP: number | null;
  maxOutputTokens: number | null;
};

export async function getDefaultWorkspaceAiConfiguration(workspaceId: string) {
  const configuration = await findDefaultWorkspaceAiConfiguration(workspaceId);

  if (!configuration) {
    throw new HTTPError({
      status: 409,
      statusText: 'Conflict',
      message: 'The workspace does not have an enabled default AI configuration',
    });
  }

  return configuration;
}
