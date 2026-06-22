import type { InsertApiKeyInput, UpdateApiKeyInput } from '~/server/types/api-key.ts';
import { eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { apiKeys } from '~/server/database/schema.ts';

export async function findApiKeyByHash(keyHash: string) {
  const [apiKey] = await db
    .select({
      id: apiKeys.id,
      organizationId: apiKeys.organizationId,
      workspaceId: apiKeys.workspaceId,
      scopes: apiKeys.scopes,
      expiresAt: apiKeys.expiresAt,
      revokedAt: apiKeys.revokedAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.keyHash, keyHash))
    .limit(1);
  return apiKey;
}

export async function findApiKeyById(id: string) {
  const [apiKey] = await db
    .select({ organizationId: apiKeys.organizationId, revokedAt: apiKeys.revokedAt })
    .from(apiKeys)
    .where(eq(apiKeys.id, id))
    .limit(1);
  return apiKey;
}

export async function insertApiKey(input: InsertApiKeyInput) {
  const [apiKey] = await db.insert(apiKeys).values(input).returning({
    id: apiKeys.id,
    name: apiKeys.name,
    keyPrefix: apiKeys.keyPrefix,
    scopes: apiKeys.scopes,
  });
  return apiKey;
}

export async function updateApiKey(id: string, input: UpdateApiKeyInput) {
  const [apiKey] = await db
    .update(apiKeys)
    .set(input)
    .where(eq(apiKeys.id, id))
    .returning({ id: apiKeys.id, revokedAt: apiKeys.revokedAt });
  return apiKey;
}
