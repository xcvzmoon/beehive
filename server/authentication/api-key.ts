import type { H3Event } from 'h3';
import { createHash, randomBytes } from 'node:crypto';
import { findApiKeyByHash } from '~/server/repositories/api-keys.ts';

export type ApiKeyContext = {
  apiKeyId: string;
  organizationId: string;
  workspaceId: string;
  scopes: string[];
};

export async function authenticateApiKey(event: H3Event): Promise<ApiKeyContext | undefined> {
  const token = getBearerToken(event.req.headers.get('authorization'));

  if (!token) {
    return undefined;
  }

  const keyHash = hashApiKey(token);
  const apiKey = await findApiKeyByHash(keyHash);

  if (!apiKey || apiKey.revokedAt || (apiKey.expiresAt && apiKey.expiresAt <= new Date())) {
    return undefined;
  }

  return {
    apiKeyId: apiKey.id,
    organizationId: apiKey.organizationId,
    workspaceId: apiKey.workspaceId,
    scopes: isStringArray(apiKey.scopes) ? apiKey.scopes : [],
  };
}

export function hashApiKey(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function generateApiKey() {
  return `bh_${randomBytes(32).toString('base64url')}`;
}

function getBearerToken(authorization: string | null) {
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.slice('Bearer '.length).trim();
  return token || null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
