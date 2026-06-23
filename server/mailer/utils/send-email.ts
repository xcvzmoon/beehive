import type { SendEmailOptions } from '~/server/mailer/types.ts';
import { Effect } from 'effect';
import { from } from '~/server/config/mailer.ts';
import { MailerError } from '~/server/errors/mailer.ts';
import { email } from '~/server/mailer/index.ts';

export function sendEmail(options: SendEmailOptions) {
  return Effect.tryPromise({
    try: async () => {
      const { from: sender = from, ...rest } = options;
      return email.send({ ...rest, from: sender });
    },
    catch: (error) =>
      new MailerError({
        operation: 'sendEmail',
        message: error instanceof Error ? error.message : 'Failed to send email',
      }),
  });
}
