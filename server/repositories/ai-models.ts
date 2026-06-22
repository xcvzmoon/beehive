import type { InsertAiModelInput } from '~/server/types/ai-model.ts';
import { and, eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { aiConfigurations, aiModels, aiProviders } from '~/server/database/schema.ts';

export async function findAiModelByProviderAndName(providerKey: string, modelName: string) {
  const [model] = await db
    .select({ id: aiModels.id, providerId: aiProviders.id })
    .from(aiModels)
    .innerJoin(aiProviders, eq(aiModels.providerId, aiProviders.id))
    .where(and(eq(aiProviders.key, providerKey), eq(aiModels.name, modelName)))
    .limit(1);
  return model;
}

export async function findAiModelByProviderIdAndName(providerId: string, modelName: string) {
  const [model] = await db
    .select({ id: aiModels.id })
    .from(aiModels)
    .where(and(eq(aiModels.providerId, providerId), eq(aiModels.name, modelName)))
    .limit(1);
  return model;
}

export async function findWorkspaceAiModels(workspaceId: string) {
  return db
    .select({
      id: aiModels.id,
      object: aiModels.kind,
      createdAt: aiModels.createdAt,
      provider: aiProviders.key,
      name: aiModels.name,
      displayName: aiModels.displayName,
    })
    .from(aiConfigurations)
    .innerJoin(aiModels, eq(aiConfigurations.modelId, aiModels.id))
    .innerJoin(aiProviders, eq(aiConfigurations.providerId, aiProviders.id))
    .where(
      and(
        eq(aiConfigurations.workspaceId, workspaceId),
        eq(aiModels.enabled, true),
        eq(aiProviders.enabled, true),
      ),
    );
}

export async function updateAiModelFromCatalog(input: InsertAiModelInput) {
  await db
    .insert(aiModels)
    .values(input)
    .onConflictDoUpdate({
      target: [aiModels.providerId, aiModels.name],
      set: {
        displayName: input.displayName,
        kind: input.kind,
        enabled: input.enabled,
        updatedAt: new Date(),
      },
    });
}
