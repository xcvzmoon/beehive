import { createEmail } from 'unemail';
import smtp from 'unemail/driver/smtp';
import { withCircuitBreaker, withDedupe, withLogger, withRetry } from 'unemail/middleware';
import { withRender } from 'unemail/render';
import { handlebarsRenderer } from 'unemail/render/handlebars';
import { mailerConfig } from '~/server/config/mailer.ts';

export const email = createEmail({
  driver: withCircuitBreaker(
    withRetry(
      withDedupe(smtp(mailerConfig), {
        strategy: 'contentHash',
        ttlSeconds: 60,
      }),
      {
        retries: 3,
        backoff: 'full-jitter',
      },
    ),
    {
      threshold: 5,
      cooldownMs: 30_000,
    },
  ),
})
  .use(withRender(handlebarsRenderer()))
  .use(withLogger({ redactLocalPart: true }));
