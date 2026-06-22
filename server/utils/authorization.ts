import { HTTPError } from 'nitro';
import { findOrganizationMember } from '~/server/repositories/organization-members.ts';
import { findWorkspaceMember } from '~/server/repositories/workspace-members.ts';
import { findWorkspaceOrganizationId } from '~/server/repositories/workspaces.ts';

export async function requireOrganizationAdmin(organizationId: string, userId: string) {
  const membership = await findOrganizationMember(organizationId, userId);

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    throw new HTTPError({
      status: 403,
      statusText: 'Forbidden',
      message: 'Organization admin access is required',
    });
  }
}

export async function requireWorkspaceOwner(workspaceId: string, userId: string) {
  const membership = await findWorkspaceMember(workspaceId, userId);

  if (membership?.role !== 'owner') {
    throw new HTTPError({
      status: 403,
      statusText: 'Forbidden',
      message: 'Workspace owner access is required',
    });
  }

  return membership.organizationId;
}

export async function getWorkspaceOrganizationId(workspaceId: string) {
  const organizationId = await findWorkspaceOrganizationId(workspaceId);

  if (!organizationId) {
    throw new HTTPError({
      status: 404,
      statusText: 'Not Found',
      message: 'Workspace was not found',
    });
  }

  return organizationId;
}
