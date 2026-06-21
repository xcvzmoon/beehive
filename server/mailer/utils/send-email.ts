import type { SendEmailOptions } from '~/server/mailer/types.ts';
import { from } from '~/server/config/mailer.ts';
import { email } from '~/server/mailer/index.ts';

export async function sendEmail(options: SendEmailOptions) {
  const { from: sender = from, ...rest } = options;
  return email.send({ ...rest, from: sender });
}
