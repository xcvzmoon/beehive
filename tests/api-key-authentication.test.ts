import type { Effect } from 'effect';
import type { H3Event } from 'nitro';
import type * as ApiKeyModule from '~/server/authentication/api-key.ts';
import { Effect as EffectRuntime } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';

const repository = vi.hoisted(() => ({
  selectApiKeyByPrefix: vi.fn(),
  updateApiKeyLastUsed: vi.fn(),
}));

vi.mock('~/server/repositories/api-keys.repository.ts', () => repository);

process.env.API_KEY_PEPPER = 'enterprise-grade-pepper-value-32-chars-minimum';
process.env.API_KEY_ENVIRONMENT = 'test';

type PersistedApiKey = {
  id: string;
  organizationId: string;
  workspaceId: string;
  scopes: unknown;
  keyHash: string;
  expiresAt: Date | null;
  revokedAt: Date | null;
};

const missingValue = void 0;

const persistedApiKey = {
  id: 'api-key-1',
  organizationId: 'organization-1',
  workspaceId: 'workspace-1',
  scopes: ['models:read', 'inference:responses'],
  expiresAt: null,
  revokedAt: null,
} satisfies Omit<PersistedApiKey, 'keyHash'>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('API key authentication', () => {
  it('generates non-recoverable API keys with enterprise-safe prefix lookup material', async () => {
    const apiKeyModule = await loadApiKeyModule();
    const generated = apiKeyModule.generateApiKey();

    expect(generated.key).toMatch(/^bh_test_v1_[A-Za-z0-9_-]{16}_[A-Za-z0-9_-]{43}$/u);
    expect(generated.keyPrefix).toMatch(/^bh_test_v1_[A-Za-z0-9_-]{16}$/u);
    expect(generated.key.startsWith(`${generated.keyPrefix}_`)).toBe(true);
    expect(generated.keyHash).toHaveLength(64);
    expect(generated.keyHash).toBe(apiKeyModule.hashApiKey(generated.key));
    expect(generated.keyHash).not.toContain(generated.key);
  });

  it('authenticates a valid bearer API key, returns tenant context, and records last use', async () => {
    const apiKeyModule = await loadApiKeyModule();
    const generated = apiKeyModule.generateApiKey();
    const savedApiKey = {
      ...persistedApiKey,
      keyHash: generated.keyHash,
    } satisfies PersistedApiKey;

    repository.selectApiKeyByPrefix.mockReturnValue(succeed(savedApiKey));
    repository.updateApiKeyLastUsed.mockReturnValue(succeed(missingValue));

    const context = await run(apiKeyModule.authenticateApiKey(createEvent(generated.key)));

    expect(repository.selectApiKeyByPrefix).toHaveBeenCalledExactlyOnceWith(generated.keyPrefix);
    expect(repository.updateApiKeyLastUsed).toHaveBeenCalledExactlyOnceWith(savedApiKey.id);
    expect(context).toStrictEqual({
      apiKeyId: savedApiKey.id,
      organizationId: savedApiKey.organizationId,
      workspaceId: savedApiKey.workspaceId,
      scopes: savedApiKey.scopes,
    });
  });

  it('rejects malformed tokens before touching persistence to limit credential probing', async () => {
    const apiKeyModule = await loadApiKeyModule();
    const context = await run(apiKeyModule.authenticateApiKey(createEvent('not-a-beehive-key')));

    expect(context).toBeNull();
    expect(repository.selectApiKeyByPrefix).not.toHaveBeenCalled();
    expect(repository.updateApiKeyLastUsed).not.toHaveBeenCalled();
  });

  it('rejects replay attempts when the prefix exists but the secret hash does not match', async () => {
    const apiKeyModule = await loadApiKeyModule();
    const legitimate = apiKeyModule.generateApiKey();
    const attacker = `${legitimate.keyPrefix}_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`;

    repository.selectApiKeyByPrefix.mockReturnValue(
      succeed({ ...persistedApiKey, keyHash: legitimate.keyHash }),
    );

    const context = await run(apiKeyModule.authenticateApiKey(createEvent(attacker)));

    expect(context).toBeNull();
    expect(repository.selectApiKeyByPrefix).toHaveBeenCalledExactlyOnceWith(legitimate.keyPrefix);
    expect(repository.updateApiKeyLastUsed).not.toHaveBeenCalled();
  });

  it('rejects expired and revoked keys without updating last-used telemetry', async () => {
    const apiKeyModule = await loadApiKeyModule();
    const generated = apiKeyModule.generateApiKey();
    const unusableStates = [
      { expiresAt: new Date('2024-01-01T00:00:00.000Z'), revokedAt: null },
      { expiresAt: null, revokedAt: new Date('2024-01-01T00:00:00.000Z') },
    ];

    await Promise.all(
      unusableStates.map(async (state) => {
        repository.selectApiKeyByPrefix.mockReturnValueOnce(
          succeed({ ...persistedApiKey, keyHash: generated.keyHash, ...state }),
        );

        const context = await run(apiKeyModule.authenticateApiKey(createEvent(generated.key)));

        expect(context).toBeNull();
      }),
    );

    expect(repository.updateApiKeyLastUsed).not.toHaveBeenCalled();
  });
});

async function loadApiKeyModule(): Promise<typeof ApiKeyModule> {
  return import('~/server/authentication/api-key.ts');
}

function createEvent(token: string): H3Event {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return {
    req: {
      headers: new Headers({ authorization: `Bearer ${token}` }),
    },
  } as H3Event;
}

async function run<A, E>(effect: Effect.Effect<A, E, never>) {
  return EffectRuntime.runPromise(effect);
}

function succeed<T>(value: T) {
  return EffectRuntime.succeed(value);
}
