import { defineHandler } from 'nitro';
import { auth } from '~/server/authentication/index.ts';

export default defineHandler(async (event) => {
  return auth.handler(event.req);
});
