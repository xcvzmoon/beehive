import type { EmailMessage } from 'unemail';

export type SendEmailOptions = Omit<EmailMessage, 'from'> & { from?: string };

export type ResetPasswordEmailOptions = {
  to: string;
  name?: string | null;
  url: string;
  expiresInSeconds: number;
};

export type SendVerificationOTPEmailOptions = {
  to: string;
  otp: string;
  type: EmailOTPType;
  expiresInSeconds: number;
};

export type EmailOTPType = 'sign-in' | 'email-verification' | 'forget-password' | 'change-email';
