import type { AiConfiguration } from '~/server/types/ai-configuration.ts';
import type { AiModel, InsertAiModelInput } from '~/server/types/ai-model.ts';
import type { AiProvider } from '~/server/types/ai-provider.ts';
import { and, eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { aiConfigurations, aiModels, aiProviders } from '~/server/database/schema.ts';
import { databaseEffect } from '~/server/utils/effects.ts';
import { logger } from '~/server/utils/logger.ts';

export function selectAiModelByKeyAndName(key: AiProvider['key'], name: AiModel['name']) {
  return databaseEffect({
    table: 'ai-models',
    callback: 'selectAiModelByKeyAndName',
    execute: async () => {
      const result = await db
        .select({
          id: aiModels.id,
          providerId: aiProviders.id,
        })
        .from(aiModels)
        .innerJoin(aiProviders, eq(aiModels.providerId, aiProviders.id))
        .where(and(eq(aiProviders.key, key), eq(aiModels.name, name)))
        .limit(1);

      return result.at(0);
    },
  });
}

export function selectAiModelByProviderIdAndName(
  providerId: AiModel['providerId'],
  name: AiModel['name'],
) {
  return databaseEffect({
    table: 'ai-models',
    callback: 'selectAiModelByProviderIdAndName',
    execute: async () => {
      const result = await db
        .select({ id: aiModels.id })
        .from(aiModels)
        .where(and(eq(aiModels.providerId, providerId), eq(aiModels.name, name)))
        .limit(1);

      return result.at(0);
    },
  });
}

export function selectAiModelsInWorkspace(workspaceId: AiConfiguration['workspaceId']) {
  return databaseEffect({
    table: 'ai-models',
    callback: 'selectAiModelsInWorkspace',
    execute: async () => {
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
    },
  });
}

export function updateAiModelFromCatalog(input: InsertAiModelInput) {
  return databaseEffect({
    table: 'ai-models',
    callback: 'updateAiModelFromCatalog',
    execute: async () => {
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

      logger.success(`Updated AI model catalog entry -> ${input.name}`);
    },
  });
}
