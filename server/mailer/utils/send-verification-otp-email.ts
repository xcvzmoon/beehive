import type { EmailOTPType, SendVerificationOTPEmailOptions } from '~/server/mailer/types.ts';
import { loadEmailTemplate } from '~/server/mailer/utils/load-email-template.ts';
import { sendEmail } from '~/server/mailer/utils/send-email.ts';
import { formatDuration } from '~/server/utils/formatter.ts';

export async function sendVerificationOTPEmail(options: SendVerificationOTPEmailOptions) {
  const expirationLabel = formatDuration(options.expiresInSeconds);
  const purpose = getOTPPurpose(options.type);

  const otpTemplate = await loadEmailTemplate('otp.hbs');
  const result = await sendEmail({
    to: options.to,
    subject: getOTPSubject(options.type),
    preheader: `Your verification code will expire in ${expirationLabel}.`,
    text: [
      `Your verification code is: ${options.otp}`,
      '',
      `Use this code to ${purpose}.`,
      `This code expires in ${expirationLabel}.`,
      '',
      `If you did not request this code for ${options.to}, you can safely ignore this email.`,
    ].join('\n'),
    handlebars: otpTemplate,
    handlebarsVars: {
      otp: options.otp,
      recipientEmail: options.to,
      expirationLabel,
      purpose,
    },
  });

  if (result.error) {
    console.error(result.error);
    throw result.error;
  }

  return result.data;
}

function getOTPPurpose(type: EmailOTPType) {
  switch (type) {
    case 'sign-in':
      return 'sign in to your account';

    case 'forget-password':
      return 'reset your password';

    case 'change-email':
      return 'confirm your new email address';

    case 'email-verification':
      return 'verify your email address';

    default:
      return 'verify your account';
  }
}

function getOTPSubject(type: EmailOTPType) {
  switch (type) {
    case 'sign-in':
      return 'Your sign-in code';

    case 'forget-password':
      return 'Reset your password';

    case 'change-email':
      return 'Confirm your new email address';

    case 'email-verification':
      return 'Verify your email address';

    default:
      return 'Your verification code';
  }
}
