import type { Effect } from 'effect';
import type * as AuthorizationModule from '~/server/utils/authorization.ts';
import { Cause, Effect as EffectRuntime, Option } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';

const repositories = vi.hoisted(() => ({
  selectOrganizationMember: vi.fn(),
  selectWorkspaceMember: vi.fn(),
  selectWorkspaceOrganizationId: vi.fn(),
}));

vi.mock('~/server/repositories/organization-members.repository.ts', () => ({
  selectOrganizationMember: repositories.selectOrganizationMember,
}));

vi.mock('~/server/repositories/workspace-members.repository.ts', () => ({
  selectWorkspaceMember: repositories.selectWorkspaceMember,
}));

vi.mock('~/server/repositories/workspaces.repository.ts', () => ({
  selectWorkspaceOrganizationId: repositories.selectWorkspaceOrganizationId,
}));

const missingRecord = void 0;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('authorization effects', () => {
  it('allows organization owners and admins while denying lower-privilege members', async () => {
    const authorization = await loadAuthorizationModule();
    const privilegedRoles = ['owner', 'admin'];

    await Promise.all(
      privilegedRoles.map(async (role) => {
        repositories.selectOrganizationMember.mockReturnValueOnce(succeed({ role }));

        await expect(
          run(authorization.requireOrganizationAdmin('organization-1', `user-${role}`)),
        ).resolves.toBeUndefined();
      }),
    );

    repositories.selectOrganizationMember.mockReturnValueOnce(succeed({ role: 'member' }));

    await expectHttpFailure(
      authorization.requireOrganizationAdmin('organization-1', 'user-member'),
      403,
      'Organization admin access is required',
    );
  });

  it('denies missing organization memberships without disclosing tenant existence', async () => {
    const authorization = await loadAuthorizationModule();
    repositories.selectOrganizationMember.mockReturnValue(succeed(missingRecord));

    await expectHttpFailure(
      authorization.requireOrganizationAdmin('organization-2', 'user-2'),
      403,
      'Organization admin access is required',
    );
    expect(repositories.selectOrganizationMember).toHaveBeenCalledExactlyOnceWith(
      'organization-2',
      'user-2',
    );
  });

  it('returns the organization boundary only for workspace owners', async () => {
    const authorization = await loadAuthorizationModule();
    repositories.selectWorkspaceMember.mockReturnValue(
      succeed({ organizationId: 'organization-3', role: 'owner' }),
    );

    await expect(
      run(authorization.requireWorkspaceOwner('workspace-3', 'user-owner')),
    ).resolves.toBe('organization-3');
  });

  it('rejects workspace members who are not owners', async () => {
    const authorization = await loadAuthorizationModule();
    repositories.selectWorkspaceMember.mockReturnValue(
      succeed({ organizationId: 'organization-4', role: 'admin' }),
    );

    await expectHttpFailure(
      authorization.requireWorkspaceOwner('workspace-4', 'user-admin'),
      403,
      'Workspace owner access is required',
    );
  });

  it('maps missing workspaces to a stable not-found failure for callers', async () => {
    const authorization = await loadAuthorizationModule();
    repositories.selectWorkspaceOrganizationId.mockReturnValue(succeed(missingRecord));

    await expectHttpFailure(
      authorization.getWorkspaceOrganizationId('workspace-missing'),
      404,
      'Workspace was not found',
    );
    expect(repositories.selectWorkspaceOrganizationId).toHaveBeenCalledExactlyOnceWith(
      'workspace-missing',
    );
  });
});

async function loadAuthorizationModule(): Promise<typeof AuthorizationModule> {
  return import('~/server/utils/authorization.ts');
}

async function run<A, E>(effect: Effect.Effect<A, E, never>) {
  return EffectRuntime.runPromise(effect);
}

async function expectHttpFailure<A, E>(
  effect: Effect.Effect<A, E, never>,
  status: number,
  message: string,
) {
  const exit = await EffectRuntime.runPromiseExit(effect);

  if (exit._tag === 'Success') {
    throw new Error('Expected authorization effect to fail');
  }

  const failure = Cause.failureOption(exit.cause);

  if (Option.isNone(failure)) {
    throw new Error('Expected authorization effect to fail with an HTTPError');
  }

  expect(failure.value).toMatchObject({ status, message });
}

function succeed<T>(value: T) {
  return EffectRuntime.succeed(value);
}
