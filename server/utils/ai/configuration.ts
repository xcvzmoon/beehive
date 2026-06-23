import { Effect } from 'effect';
import { selectAiConfigurationOfDefaultWorkspace } from '~/server/repositories/ai-configurations.repository.ts';
import { failHttp } from '~/server/utils/effects.ts';

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

export function getDefaultWorkspaceAiConfiguration(workspaceId: string) {
  return Effect.gen(function* getDefaultWorkspaceAiConfigurationProgram() {
    const configuration = yield* selectAiConfigurationOfDefaultWorkspace(workspaceId);

    if (!configuration) {
      return yield* failHttp({
        status: 409,
        statusText: 'Conflict',
        message: 'The workspace does not have an enabled default AI configuration',
      });
    }

    return configuration;
  });
}
