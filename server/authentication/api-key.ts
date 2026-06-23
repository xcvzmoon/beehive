import type { H3Event } from 'nitro';
import { Effect } from 'effect';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { apiKeyConfig } from '~/server/config/api-key.ts';
import {
  selectApiKeyByPrefix,
  updateApiKeyLastUsed,
} from '~/server/repositories/api-keys.repository.ts';

const API_KEY_PREFIX = 'bh';
const API_KEY_VERSION = 'v1';
const API_KEY_PUBLIC_ID_BYTES = 12;
const API_KEY_SECRET_BYTES = 32;
const API_KEY_PATTERN = /^bh_(live|test)_v1_([A-Za-z0-9_-]{16})_([A-Za-z0-9_-]{43})$/;

export type ApiKeyContext = {
  apiKeyId: string;
  organizationId: string;
  workspaceId: string;
  scopes: string[];
};

export type GeneratedApiKey = {
  key: string;
  keyPrefix: string;
  keyHash: string;
};

export function authenticateApiKey(event: H3Event) {
  return Effect.gen(function* authenticateApiKeyProgram() {
    const token = getBearerToken(event.req.headers.get('authorization'));

    const parsedToken = token ? parseApiKey(token) : null;

    if (!parsedToken) {
      return null;
    }

    const keyHash = hashApiKey(parsedToken.key);
    const apiKey = yield* selectApiKeyByPrefix(parsedToken.keyPrefix);

    if (
      !apiKey ||
      !isHashEqual(keyHash, apiKey.keyHash) ||
      apiKey.revokedAt ||
      (apiKey.expiresAt && apiKey.expiresAt <= new Date())
    ) {
      return null;
    }

    yield* updateApiKeyLastUsed(apiKey.id);

    return {
      apiKeyId: apiKey.id,
      organizationId: apiKey.organizationId,
      workspaceId: apiKey.workspaceId,
      scopes: isStringArray(apiKey.scopes) ? apiKey.scopes : [],
    } satisfies ApiKeyContext;
  });
}

export function hashApiKey(value: string) {
  return createHmac('sha256', apiKeyConfig.pepper).update(value).digest('hex');
}

export function generateApiKey(): GeneratedApiKey {
  const publicId = randomBytes(API_KEY_PUBLIC_ID_BYTES).toString('base64url');
  const secret = randomBytes(API_KEY_SECRET_BYTES).toString('base64url');
  const keyPrefix = `${API_KEY_PREFIX}_${apiKeyConfig.environment}_${API_KEY_VERSION}_${publicId}`;
  const key = `${keyPrefix}_${secret}`;

  return {
    key,
    keyPrefix,
    keyHash: hashApiKey(key),
  };
}

function getBearerToken(authorization: string | null) {
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.slice('Bearer '.length).trim();
  return token || null;
}

function parseApiKey(value: string) {
  const match = API_KEY_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const [, environment, publicId] = match;

  return {
    key: value,
    environment,
    publicId,
    keyPrefix: `${API_KEY_PREFIX}_${environment}_${API_KEY_VERSION}_${publicId}`,
  };
}

function isHashEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left, 'hex');
  const rightBuffer = Buffer.from(right, 'hex');

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
