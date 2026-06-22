import { defineHandler, HTTPError } from 'nitro';
import { z } from 'zod';
import { createWorkspaceWithOwner } from '~/server/repositories/workspaces.ts';
import { requireOrganizationAdmin } from '~/server/utils/authorization.ts';

const bodySchema = z.object({ name: z.string().min(1), slug: z.string().min(1).max(100) });

export default defineHandler(async (event) => {
  const organizationId = event.context.params?.organizationId;
  const userId = event.context.auth?.user.id;

  if (!organizationId || !userId) {
    throw new HTTPError({
      status: 401,
      statusText: 'Unauthorized',
      message: 'A session is required',
    });
  }

  await requireOrganizationAdmin(organizationId, userId);
  const body = bodySchema.parse(await event.req.json());

  return createWorkspaceWithOwner(
    { ...body, organizationId, createdByUserId: userId },
    {
      organizationId,
      userId,
      role: 'owner',
    },
  );
});
