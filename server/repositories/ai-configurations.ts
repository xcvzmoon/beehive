import type { InsertAiConfigurationInput } from '~/server/types/ai-configuration.ts';
import { and, eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { aiConfigurations, aiModels, aiProviders } from '~/server/database/schema.ts';

export async function findDefaultWorkspaceAiConfiguration(workspaceId: string) {
  const [configuration] = await db
    .select({
      configurationId: aiConfigurations.id,
      organizationId: aiConfigurations.organizationId,
      workspaceId: aiConfigurations.workspaceId,
      providerId: aiProviders.id,
      modelId: aiModels.id,
      providerKey: aiProviders.key,
      providerType: aiProviders.type,
      providerBaseUrl: aiProviders.baseUrl,
      modelName: aiModels.name,
      systemPrompt: aiConfigurations.systemPrompt,
      temperature: aiConfigurations.temperature,
      topP: aiConfigurations.topP,
      maxOutputTokens: aiConfigurations.maxOutputTokens,
    })
    .from(aiConfigurations)
    .innerJoin(aiProviders, eq(aiConfigurations.providerId, aiProviders.id))
    .innerJoin(aiModels, eq(aiConfigurations.modelId, aiModels.id))
    .where(
      and(
        eq(aiConfigurations.workspaceId, workspaceId),
        eq(aiConfigurations.isDefault, true),
        eq(aiProviders.enabled, true),
        eq(aiModels.enabled, true),
      ),
    )
    .limit(1);
  return configuration;
}

export async function createDefaultAiConfiguration(input: InsertAiConfigurationInput) {
  return db.transaction(async (tx) => {
    await tx
      .update(aiConfigurations)
      .set({ isDefault: false })
      .where(eq(aiConfigurations.workspaceId, input.workspaceId));
    const [configuration] = await tx.insert(aiConfigurations).values(input).returning();
    return configuration;
  });
}
