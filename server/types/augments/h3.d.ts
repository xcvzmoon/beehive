import type { Session, User } from 'better-auth';
import type { ApiKeyContext } from '~/server/authentication/api-key.ts';
import 'h3';

declare module 'h3' {
  interface H3EventContext {
    auth?: {
      session: Session;
      user: User;
    };
    apiKey?: ApiKeyContext;
  }
}
