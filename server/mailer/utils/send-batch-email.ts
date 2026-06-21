import type { EmailResult, Result } from 'unemail';
import type { SendEmailOptions } from '~/server/mailer/types.ts';
import { from } from '~/server/config/mailer.ts';
import { email } from '~/server/mailer/index.ts';

export async function sendBatchEmail(batchOptions: SendEmailOptions[]) {
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
}
