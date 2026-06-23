import type { EmailResult, Result } from 'unemail';
import type { SendEmailOptions } from '~/server/mailer/types.ts';
import { Effect } from 'effect';
import { from } from '~/server/config/mailer.ts';
import { MailerError } from '~/server/errors/mailer.ts';
import { email } from '~/server/mailer/index.ts';

export function sendBatchEmail(batchOptions: SendEmailOptions[]) {
  return Effect.tryPromise({
    try: async () => {
      const emailResults: Result<EmailResult>[] = [];
      const batchEmailResults = email.sendBatchStream(
        batchOptions.map((options) => {
          const { from: sender = from, ...rest } = options;
          return { ...rest, from: sender };
        }),
      );

      for await (const emailResult of batchEmailResults) {
        emailResults.push(emailResult);
      }

      return emailResults;
    },
    catch: (error) =>
      new MailerError({
        operation: 'sendBatchEmail',
        message: error instanceof Error ? error.message : 'Failed to send batch email',
      }),
  });
}
