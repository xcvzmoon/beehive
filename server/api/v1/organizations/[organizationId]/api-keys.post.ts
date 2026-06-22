import { defineHandler, HTTPError } from 'nitro';
import { z } from 'zod';
import { generateApiKey, hashApiKey } from '~/server/authentication/api-key.ts';
import { insertApiKey } from '~/server/repositories/api-keys.ts';
import {
  getWorkspaceOrganizationId,
  requireOrganizationAdmin,
} from '~/server/utils/authorization.ts';

const scopeSchema = z.enum(['models:read', 'inference:responses', 'inference:embeddings']);
const bodySchema = z.object({
  name: z.string().min(1).max(100),
  workspaceId: z.uuid(),
  scopes: z.array(scopeSchema).min(1),
  expiresAt: z.coerce.date().optional(),
});

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

  if ((await getWorkspaceOrganizationId(body.workspaceId)) !== organizationId) {
    throw new HTTPError({
      status: 422,
      statusText: 'Unprocessable Content',
      message: 'The workspace does not belong to this organization',
    });
  }

  const key = generateApiKey();
  const apiKey = await insertApiKey({
    organizationId,
    workspaceId: body.workspaceId,
    createdByUserId: userId,
    name: body.name,
    keyPrefix: key.slice(0, 11),
    keyHash: hashApiKey(key),
    scopes: body.scopes,
    expiresAt: body.expiresAt,
  });

  return { ...apiKey, key };
});
