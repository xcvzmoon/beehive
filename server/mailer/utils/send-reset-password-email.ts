import type { ResetPasswordEmailOptions } from '~/server/mailer/types.ts';
import { loadEmailTemplate } from '~/server/mailer/utils/load-email-template.ts';
import { sendEmail } from '~/server/mailer/utils/send-email.ts';
import { formatDuration } from '~/server/utils/formatter.ts';

export async function sendResetPasswordEmail(options: ResetPasswordEmailOptions) {
  const recipientName = getRecipientName(options.name);
  const expirationLabel = formatDuration(options.expiresInSeconds);

  const resetPasswordTemplate = await loadEmailTemplate('reset-password.hbs');
  const result = await sendEmail({
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
    console.error(result.error);
    throw result.error;
  }

  return result.data;
}

function getRecipientName(name?: string | null) {
  const recipientName = name?.trim() ?? 'there';
  return recipientName.length > 0 ? recipientName : 'there';
}
