import { defineHandler, HTTPError } from 'nitro';
import { z } from 'zod';
import { createOrganizationWithOwner } from '~/server/repositories/organizations.ts';

const bodySchema = z.object({ name: z.string().min(1), slug: z.string().min(1).max(100) });

export default defineHandler(async (event) => {
  const body = bodySchema.parse(await event.req.json());
  const userId = event.context.auth?.user.id;

  if (!userId) {
    throw new HTTPError({
      status: 401,
      statusText: 'Unauthorized',
      message: 'A session is required',
    });
  }

  return createOrganizationWithOwner(
    { ...body, createdByUserId: userId },
    {
      userId,
      role: 'owner',
    },
  );
});
