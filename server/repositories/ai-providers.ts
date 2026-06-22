import type { InsertAiProviderInput } from '~/server/types/ai-provider.ts';
import { and, eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { aiProviders } from '~/server/database/schema.ts';

export async function findEnabledAiProviderByKey(key: string) {
  const [provider] = await db
    .select({ id: aiProviders.id })
    .from(aiProviders)
    .where(and(eq(aiProviders.key, key), eq(aiProviders.enabled, true)))
    .limit(1);
  return provider;
}

export async function insertAiProvider(input: InsertAiProviderInput) {
  const [provider] = await db.insert(aiProviders).values(input).returning();
  return provider;
}

export async function updateAiProviderCatalog(input: InsertAiProviderInput) {
  await db
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
    });
}
