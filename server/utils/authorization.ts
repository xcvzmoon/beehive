import { Effect } from 'effect';
import { selectOrganizationMember } from '~/server/repositories/organization-members.repository.ts';
import { selectWorkspaceMember } from '~/server/repositories/workspace-members.repository.ts';
import { selectWorkspaceOrganizationId } from '~/server/repositories/workspaces.repository.ts';
import { BYPASSABLE_ROLES } from '~/server/utils/constants.ts';
import { failHttp } from '~/server/utils/effects.ts';

export function requireOrganizationAdmin(organizationId: string, userId: string) {
  return Effect.gen(function* requireOrganizationAdminProgram() {
    const organizationMember = yield* selectOrganizationMember(organizationId, userId);

    if (!organizationMember || !BYPASSABLE_ROLES.includes(organizationMember.role)) {
      yield* failHttp({
        status: 403,
        statusText: 'Forbidden',
        message: 'Organization admin access is required',
      });
    }
  });
}

export function requireWorkspaceOwner(workspaceId: string, userId: string) {
  return Effect.gen(function* requireWorkspaceOwnerProgram() {
    const membership = yield* selectWorkspaceMember(workspaceId, userId);

    if (membership?.role !== 'owner') {
      return yield* failHttp({
        status: 403,
        statusText: 'Forbidden',
        message: 'Workspace owner access is required',
      });
    }

    return membership.organizationId;
  });
}

export function getWorkspaceOrganizationId(workspaceId: string) {
  return Effect.gen(function* getWorkspaceOrganizationIdProgram() {
    const organizationId = yield* selectWorkspaceOrganizationId(workspaceId);

    if (!organizationId) {
      return yield* failHttp({
        status: 404,
        statusText: 'Not Found',
        message: 'Workspace was not found',
      });
    }

    return organizationId;
  });
}
