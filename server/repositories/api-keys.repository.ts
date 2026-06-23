import type { ApiKey, InsertApiKeyInput, UpdateApiKeyInput } from '~/server/types/api-key.ts';
import { eq } from 'drizzle-orm';
import { db } from '~/server/database/index.ts';
import { apiKeys } from '~/server/database/schema.ts';
import { databaseEffect } from '~/server/utils/effects.ts';
import { logger } from '~/server/utils/logger.ts';

export function selectApiKeyByHash(keyHash: ApiKey['keyHash']) {
  return databaseEffect({
    table: 'api-keys',
    callback: 'selectApiKeyByHash',
    execute: async () => {
      const result = await db
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

      return result.at(0);
    },
  });
}

export function selectApiKeyByPrefix(keyPrefix: ApiKey['keyPrefix']) {
  return databaseEffect({
    table: 'api-keys',
    callback: 'selectApiKeyByPrefix',
    execute: async () => {
      const result = await db
        .select({
          id: apiKeys.id,
          organizationId: apiKeys.organizationId,
          workspaceId: apiKeys.workspaceId,
          scopes: apiKeys.scopes,
          keyHash: apiKeys.keyHash,
          expiresAt: apiKeys.expiresAt,
          revokedAt: apiKeys.revokedAt,
        })
        .from(apiKeys)
        .where(eq(apiKeys.keyPrefix, keyPrefix))
        .limit(1);

      return result.at(0);
    },
  });
}

export function selectApiKeyById(id: ApiKey['id']) {
  return databaseEffect({
    table: 'api-keys',
    callback: 'selectApiKeyById',
    execute: async () => {
      const result = await db
        .select({
          organizationId: apiKeys.organizationId,
          workspaceId: apiKeys.workspaceId,
          revokedAt: apiKeys.revokedAt,
        })
        .from(apiKeys)
        .where(eq(apiKeys.id, id))
        .limit(1);

      return result.at(0);
    },
  });
}

export function insertApiKey(input: InsertApiKeyInput) {
  return databaseEffect({
    table: 'api-keys',
    callback: 'insertApiKey',
    execute: async () => {
      const result = await db.insert(apiKeys).values(input).returning({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        scopes: apiKeys.scopes,
        expiresAt: apiKeys.expiresAt,
      });
      const apiKey = result.at(0);

      logger.success(`Inserted API key -> ${apiKey?.id}`);

      return apiKey;
    },
  });
}

export function updateApiKey(id: ApiKey['id'], input: UpdateApiKeyInput) {
  return databaseEffect({
    table: 'api-keys',
    callback: 'updateApiKey',
    execute: async () => {
      const result = await db
        .update(apiKeys)
        .set(input)
        .where(eq(apiKeys.id, id))
        .returning({ id: apiKeys.id, revokedAt: apiKeys.revokedAt });
      const apiKey = result.at(0);

      logger.success(`Updated API key -> ${apiKey?.id}`);

      return apiKey;
    },
  });
}

export function updateApiKeyLastUsed(id: ApiKey['id']) {
  return databaseEffect({
    table: 'api-keys',
    callback: 'updateApiKeyLastUsed',
    execute: async () => {
      await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, id));
    },
  });
}
