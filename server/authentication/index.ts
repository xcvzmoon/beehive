import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { Effect } from 'effect';
import { v7 as uuidV7 } from 'uuid';
import { secondaryStorage } from '~/server/authentication/secondary-storage.ts';
import { db } from '~/server/database/index.ts';
import { accounts, sessions, users, verifications } from '~/server/database/schema.ts';
import { sendResetPasswordEmail } from '~/server/mailer/utils/send-reset-password-email.ts';
import { sendVerificationOTPEmail } from '~/server/mailer/utils/send-verification-otp-email.ts';

const OTP_VERIFICATION_EXPIRES_IN = 60 * 5;
const RESET_PASSWORD_EXPIRES_IN = 60 * 60;

export const auth = betterAuth({
  basePath: '/api/v1/auth',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      account: accounts,
      session: sessions,
      user: users,
      verification: verifications,
    },
  }),
  secondaryStorage,
  advanced: {
    database: {
      generateId: () => uuidV7(),
    },
    ipAddress: {
      ipAddressHeaders: ['x-real-ip', 'x-forwarded-for'],
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  rateLimit: {
    enabled: true,
    storage: 'secondary-storage',
    modelName: 'rateLimit',
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: RESET_PASSWORD_EXPIRES_IN,
    sendResetPassword: async ({ user, url }) => {
      const { email: to, name } = user;
      const expiresInSeconds = RESET_PASSWORD_EXPIRES_IN;
      await Effect.runPromise(sendResetPasswordEmail({ to, name, url, expiresInSeconds }));
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: OTP_VERIFICATION_EXPIRES_IN,
      allowedAttempts: 3,
      storeOTP: 'hashed',
      resendStrategy: 'rotate',
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      rateLimit: {
        window: 60,
        max: 3,
      },
      sendVerificationOTP: async ({ email, otp, type }) => {
        const to = email;
        const expiresInSeconds = OTP_VERIFICATION_EXPIRES_IN;
        await Effect.runPromise(sendVerificationOTPEmail({ to, otp, type, expiresInSeconds }));
      },
    }),
  ],
});
