import type { H3Event } from 'nitro';
import { Effect } from 'effect';
import { HTTPError } from 'nitro';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';

const routeState = vi.hoisted(() => ({
  body: undefined as unknown,
}));

const repositories = vi.hoisted(() => ({
  insertOrganizationWithOwner: vi.fn(),
  insertWorkspaceWithOwner: vi.fn(),
  insertApiKey: vi.fn(),
  selectApiKeyById: vi.fn(),
  updateApiKey: vi.fn(),
  insertAuditLog: vi.fn(),
  selectAiModelsInWorkspace: vi.fn(),
}));

const authorization = vi.hoisted(() => ({
  requireOrganizationAdmin: vi.fn(),
  getWorkspaceOrganizationId: vi.fn(),
  requireWorkspaceOwner: vi.fn(),
}));

const ai = vi.hoisted(() => ({
  getDefaultWorkspaceAiConfiguration: vi.fn(),
  createOpenAiCompatibleResponse: vi.fn(),
  persistResponse: vi.fn(),
}));

const effects = vi.hoisted(() => ({
  failHttp: vi.fn(),
}));

vi.mock('~/server/repositories/organizations.repository.ts', () => ({
  insertOrganizationWithOwner: repositories.insertOrganizationWithOwner,
}));

vi.mock('~/server/repositories/workspaces.repository.ts', () => ({
  insertWorkspaceWithOwner: repositories.insertWorkspaceWithOwner,
}));

vi.mock('~/server/repositories/api-keys.repository.ts', () => ({
  insertApiKey: repositories.insertApiKey,
  selectApiKeyById: repositories.selectApiKeyById,
  updateApiKey: repositories.updateApiKey,
}));

vi.mock('~/server/repositories/audit-logs.repository.ts', () => ({
  insertAuditLog: repositories.insertAuditLog,
}));

vi.mock('~/server/repositories/ai-models.repository.ts', () => ({
  selectAiModelsInWorkspace: repositories.selectAiModelsInWorkspace,
}));

vi.mock('~/server/utils/authorization.ts', () => authorization);

vi.mock('~/server/authentication/api-key.ts', () => ({
  generateApiKey: () => ({
    key: 'bh_test_v1_publicIdentifier_secretSecretSecretSecretSecretSecretSecretSec',
    keyHash: 'hashed-key',
    keyPrefix: 'bh_test_v1_publicIdentifier',
  }),
}));

vi.mock('~/server/utils/ai/configuration.ts', () => ({
  getDefaultWorkspaceAiConfiguration: ai.getDefaultWorkspaceAiConfiguration,
}));

vi.mock('~/server/utils/ai/providers/openai-compatible.ts', () => ({
  createOpenAiCompatibleResponse: ai.createOpenAiCompatibleResponse,
}));

vi.mock('~/server/utils/ai/persist-response.ts', () => ({
  persistResponse: ai.persistResponse,
}));

vi.mock('~/server/utils/effects.ts', () => ({
  failHttp: effects.failHttp,
  parseJsonBodyWithSchema: () => Effect.succeed(routeState.body),
  readJsonBody: () => Effect.succeed(routeState.body),
}));

const missingValue = void 0;

beforeEach(() => {
  vi.clearAllMocks();
  routeState.body = missingValue;
  effects.failHttp.mockImplementation(
    (options: { status: number; statusText: string; message: string; data?: unknown }) =>
      Effect.fail(new HTTPError(options)),
  );
});

describe('control-plane route handlers', () => {
  it('creates an organization and owner membership from the authenticated session', async () => {
    const route = await import('~/server/api/v1/organizations.post.ts');
    const handler = route.default;
    const createdOrganization = { id: 'organization-1', name: 'Acme', slug: 'acme' };
    routeState.body = { name: 'Acme', slug: 'acme' };
    repositories.insertOrganizationWithOwner.mockReturnValue(succeed(createdOrganization));

    await expect(handler(createEvent({ userId: 'user-1' }))).resolves.toStrictEqual(
      createdOrganization,
    );
    expect(repositories.insertOrganizationWithOwner).toHaveBeenCalledExactlyOnceWith(
      { name: 'Acme', slug: 'acme', createdByUserId: 'user-1' },
      { userId: 'user-1', role: 'owner' },
    );
  });

  it('rejects organization creation before parsing or persistence when no session exists', async () => {
    const route = await import('~/server/api/v1/organizations.post.ts');
    const handler = route.default;

    await expectHttpFailure(handler(createEvent()), 401, 'A session is required');
    expect(repositories.insertOrganizationWithOwner).not.toHaveBeenCalled();
  });

  it('creates a workspace only after organization-admin authorization succeeds', async () => {
    const route = await import('~/server/api/v1/organizations/[organizationId]/workspaces.post.ts');
    const handler = route.default;
    const createdWorkspace = { id: 'workspace-1', name: 'Production', slug: 'production' };
    routeState.body = { name: 'Production', slug: 'production' };
    authorization.requireOrganizationAdmin.mockReturnValue(succeed(missingValue));
    repositories.insertWorkspaceWithOwner.mockReturnValue(succeed(createdWorkspace));

    await expect(
      handler(createEvent({ userId: 'user-1', params: { organizationId: 'organization-1' } })),
    ).resolves.toStrictEqual(createdWorkspace);

    expect(authorization.requireOrganizationAdmin).toHaveBeenCalledExactlyOnceWith(
      'organization-1',
      'user-1',
    );
    expect(repositories.insertWorkspaceWithOwner).toHaveBeenCalledExactlyOnceWith(
      {
        name: 'Production',
        slug: 'production',
        organizationId: 'organization-1',
        createdByUserId: 'user-1',
      },
      { organizationId: 'organization-1', userId: 'user-1', role: 'owner' },
    );
  });

  it('creates an API key only for a workspace in the requested organization and writes an audit log', async () => {
    const route = await import('~/server/api/v1/organizations/[organizationId]/api-keys.post.ts');
    const handler = route.default;
    const expiresAt = new Date('2030-01-01T00:00:00.000Z');
    routeState.body = {
      name: 'Production inference',
      workspaceId: 'workspace-1',
      scopes: ['models:read', 'inference:responses'],
      expiresAt,
    };
    authorization.requireOrganizationAdmin.mockReturnValue(succeed(missingValue));
    authorization.getWorkspaceOrganizationId.mockReturnValue(succeed('organization-1'));
    repositories.insertApiKey.mockReturnValue(
      succeed({
        id: 'api-key-1',
        name: 'Production inference',
        keyPrefix: 'bh_test_v1_publicIdentifier',
      }),
    );
    repositories.insertAuditLog.mockReturnValue(succeed({ id: 'audit-log-1' }));

    const response = await handler(
      createEvent({ userId: 'user-1', params: { organizationId: 'organization-1' } }),
    );

    expect(response).toMatchObject({
      id: 'api-key-1',
      key: 'bh_test_v1_publicIdentifier_secretSecretSecretSecretSecretSecretSecretSec',
    });
    expect(repositories.insertApiKey).toHaveBeenCalledExactlyOnceWith({
      organizationId: 'organization-1',
      workspaceId: 'workspace-1',
      createdByUserId: 'user-1',
      name: 'Production inference',
      keyPrefix: 'bh_test_v1_publicIdentifier',
      keyHash: 'hashed-key',
      scopes: ['models:read', 'inference:responses'],
      expiresAt,
    });
    expect(repositories.insertAuditLog).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        action: 'api_key.created',
        organizationId: 'organization-1',
        workspaceId: 'workspace-1',
        apiKeyId: 'api-key-1',
      }),
    );
  });

  it('rejects API key creation when the workspace belongs to another organization', async () => {
    const route = await import('~/server/api/v1/organizations/[organizationId]/api-keys.post.ts');
    const handler = route.default;
    routeState.body = { name: 'Bad key', workspaceId: 'workspace-2', scopes: ['models:read'] };
    authorization.requireOrganizationAdmin.mockReturnValue(succeed(missingValue));
    authorization.getWorkspaceOrganizationId.mockReturnValue(succeed('organization-2'));

    await expectHttpFailure(
      handler(createEvent({ userId: 'user-1', params: { organizationId: 'organization-1' } })),
      422,
      'The workspace does not belong to this organization',
    );
    expect(repositories.insertApiKey).not.toHaveBeenCalled();
    expect(repositories.insertAuditLog).not.toHaveBeenCalled();
  });

  it('revokes an API key idempotently and captures whether it was already revoked', async () => {
    const route = await import('~/server/api/v1/api-keys/[apiKeyId]/revoke.post.ts');
    const handler = route.default;
    const revokedAt = new Date('2026-01-01T00:00:00.000Z');
    repositories.selectApiKeyById.mockReturnValue(
      succeed({ organizationId: 'organization-1', workspaceId: 'workspace-1', revokedAt }),
    );
    authorization.requireOrganizationAdmin.mockReturnValue(succeed(missingValue));
    repositories.updateApiKey.mockReturnValue(succeed({ id: 'api-key-1', revokedAt }));
    repositories.insertAuditLog.mockReturnValue(succeed({ id: 'audit-log-1' }));

    await expect(
      handler(createEvent({ userId: 'user-1', params: { apiKeyId: 'api-key-1' } })),
    ).resolves.toStrictEqual({ id: 'api-key-1', revokedAt });

    expect(repositories.updateApiKey).toHaveBeenCalledExactlyOnceWith('api-key-1', { revokedAt });
    expect(repositories.insertAuditLog).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ metadata: { alreadyRevoked: true } }),
    );
  });
});

describe('data-plane route handlers', () => {
  it('lists workspace models only when the API key has models:read scope', async () => {
    const route = await import('~/server/api/v1/models.get.ts');
    const handler = route.default;
    const models = [{ id: 'model-1', name: 'gpt-enterprise' }];
    repositories.selectAiModelsInWorkspace.mockReturnValue(succeed(models));

    await expect(
      handler(createEvent({ apiKey: { workspaceId: 'workspace-1', scopes: ['models:read'] } })),
    ).resolves.toStrictEqual({ data: models });
    expect(repositories.selectAiModelsInWorkspace).toHaveBeenCalledExactlyOnceWith('workspace-1');
  });

  it('rejects model listing when the API key lacks the required scope', async () => {
    const route = await import('~/server/api/v1/models.get.ts');
    const handler = route.default;

    await expectHttpFailure(
      handler(
        createEvent({ apiKey: { workspaceId: 'workspace-1', scopes: ['inference:responses'] } }),
      ),
      403,
      'The API key does not have the models:read scope',
    );
    expect(repositories.selectAiModelsInWorkspace).not.toHaveBeenCalled();
  });

  it('creates and persists a non-streaming response through the configured provider', async () => {
    const route = await import('~/server/api/v1/responses.post.ts');
    const handler = route.default;
    const configuration = { id: 'configuration-1', workspaceId: 'workspace-1' };
    const providerResponse = { id: 'response-1', output_text: 'Hello enterprise' };
    routeState.body = { input: 'Hello', stream: false };
    ai.getDefaultWorkspaceAiConfiguration.mockReturnValue(succeed(configuration));
    ai.createOpenAiCompatibleResponse.mockReturnValue(succeed(providerResponse));
    ai.persistResponse.mockReturnValue(succeed(missingValue));

    await expect(
      handler(
        createEvent({
          apiKey: {
            apiKeyId: 'api-key-1',
            workspaceId: 'workspace-1',
            scopes: ['inference:responses'],
          },
        }),
      ),
    ).resolves.toStrictEqual(providerResponse);

    expect(ai.getDefaultWorkspaceAiConfiguration).toHaveBeenCalledExactlyOnceWith('workspace-1');
    expect(ai.createOpenAiCompatibleResponse).toHaveBeenCalledExactlyOnceWith(configuration, {
      input: 'Hello',
      stream: false,
    });
    expect(ai.persistResponse).toHaveBeenCalledExactlyOnceWith(
      configuration,
      'api-key-1',
      { input: 'Hello', stream: false },
      providerResponse,
    );
  });

  it('rejects streaming responses before provider invocation or persistence', async () => {
    const route = await import('~/server/api/v1/responses.post.ts');
    const handler = route.default;
    routeState.body = { input: 'Hello', stream: true };

    await expectHttpFailure(
      handler(
        createEvent({
          apiKey: {
            apiKeyId: 'api-key-1',
            workspaceId: 'workspace-1',
            scopes: ['inference:responses'],
          },
        }),
      ),
      501,
      'Streaming responses are not implemented yet',
    );
    expect(ai.createOpenAiCompatibleResponse).not.toHaveBeenCalled();
    expect(ai.persistResponse).not.toHaveBeenCalled();
  });

  it('rejects embeddings with the documented setup failure after scope authorization', async () => {
    const route = await import('~/server/api/v1/embeddings.post.ts');
    const handler = route.default;

    await expectHttpFailure(
      handler(
        createEvent({ apiKey: { workspaceId: 'workspace-1', scopes: ['inference:embeddings'] } }),
      ),
      501,
      'Configure an embedding model for the workspace before using embeddings',
    );
  });
});

function createEvent(
  options: {
    userId?: string;
    params?: Record<string, string>;
    apiKey?: { apiKeyId?: string; workspaceId: string; scopes: string[] };
  } = {},
): H3Event {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return {
    context: {
      auth: options.userId ? { user: { id: options.userId } } : missingValue,
      params: options.params,
      apiKey: options.apiKey,
    },
  } as H3Event;
}

async function expectHttpFailure(promise: Promise<unknown>, status: number, message: string) {
  await expect(promise).rejects.toMatchObject({ message });
  expect(effects.failHttp).toHaveBeenLastCalledWith(expect.objectContaining({ status, message }));
}

function succeed<T>(value: T) {
  return Effect.succeed(value);
}
