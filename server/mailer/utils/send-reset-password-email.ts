import type { ResetPasswordEmailOptions } from '~/server/mailer/types.ts';
import { Effect } from 'effect';
import { MailerError } from '~/server/errors/mailer.ts';
import { loadEmailTemplate } from '~/server/mailer/utils/load-email-template.ts';
import { sendEmail } from '~/server/mailer/utils/send-email.ts';
import { formatDuration } from '~/server/utils/formatter.ts';
import { logger } from '~/server/utils/logger.ts';

export function sendResetPasswordEmail(options: ResetPasswordEmailOptions) {
  return Effect.gen(function* sendResetPasswordEmailProgram() {
    const recipientName = getRecipientName(options.name);
    const expirationLabel = formatDuration(options.expiresInSeconds);

    const resetPasswordTemplate = yield* loadEmailTemplate('reset-password.hbs');
    const result = yield* sendEmail({
      to: options.to,
      subject: 'Password Reset',
      preheader: `Reset your password. This link will expire in ${expirationLabel}.`,
      text: [
        `Hi ${recipientName},`,
        '',
        'We received a request to reset your password. Open this link to choose a new password:',
        options.url,
        '',
        `This link expires in ${expirationLabel}. If you did not request this password reset, you can ignore this email.`,
      ].join('\n'),
      handlebars: resetPasswordTemplate,
      handlebarsVars: {
        url: options.url,
        recipientName,
        expirationLabel,
      },
    });

    if (result.error) {
      logger.error(result.error instanceof Error ? result.error.message : String(result.error));
      return yield* Effect.fail(
        new MailerError({
          operation: 'sendResetPasswordEmail',
          message:
            result.error instanceof Error
              ? result.error.message
              : 'Failed to send reset password email',
        }),
      );
    }

    return result.data;
  });
}

function getRecipientName(name?: string | null) {
  const recipientName = name?.trim() ?? 'there';
  return recipientName.length > 0 ? recipientName : 'there';
}
