import type { AiProvider, InsertAiProviderInput } from '~/server/types/ai-provider.ts';
import { and, eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { aiProviders } from '~/server/database/schema.ts';
import { databaseEffect } from '~/server/utils/effects.ts';
import { logger } from '~/server/utils/logger.ts';

export function selectAiProviderByKeyAndEnabled(key: AiProvider['key']) {
  return databaseEffect({
    table: 'ai-providers',
    callback: 'selectAiProviderByKeyAndEnabled',
    execute: async () => {
      const result = await db
        .select({ id: aiProviders.id })
        .from(aiProviders)
        .where(and(eq(aiProviders.key, key), eq(aiProviders.enabled, true)))
        .limit(1);

      return result.at(0);
    },
  });
}

export function insertAiProvider(input: InsertAiProviderInput) {
  return databaseEffect({
    table: 'ai-providers',
    callback: 'insertAiProvider',
    execute: async () => {
      const [inserted] = await db
        .insert(aiProviders)
        .values(input)
        .onConflictDoUpdate({
          target: aiProviders.key,
          set: {
            displayName: input.displayName,
            type: input.type,
            baseUrl: input.baseUrl,
            enabled: input.enabled,
            metadata: input.metadata,
            updatedAt: new Date(),
          },
        })
        .returning();

      logger.success(`Inserted AI provider -> ${inserted.id}`);

      return inserted;
    },
  });
}
