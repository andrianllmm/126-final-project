import { betterAuth, APIError } from 'better-auth';
import { phoneNumber } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { sendEmail } from '../../common/email.js';
import { env } from '../../config/env.js';
import { ALLOWED_EMAIL_DOMAINS, NotificationType } from '@repo/api';

const databaseUrl = env.databaseUrl;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl as string,
});

const prisma = new PrismaClient({ adapter });

const isProduction = env.nodeEnv === 'production';

export const auth = betterAuth({
  baseURL: env.betterAuthUrl,
  basePath: '/api/auth',

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,

    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Reset your password: ${url}`,
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        text: `Verify your account: ${url}`,
      });
    },
    sendOnSignUp: true,
  },

  account: {
    accountLinking: {
      enabled: true,
    },
  },

  socialProviders: {
    google: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
    },
  },

  trustedOrigins: [env.webUrl],

  onAPIError: {
    errorURL: `${env.webUrl}/auth/error`,
  },

  user: {
    deleteUser: {
      enabled: true,
    },

    additionalFields: {
      avatarUploadId: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email = user.email?.toLowerCase() ?? '';
          const domain = email.split('@')[1];

          if (!domain)
            throw new APIError('BAD_REQUEST', {
              message: 'Invalid email address',
            });

          if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
            throw new APIError('UNPROCESSABLE_ENTITY', {
              message: 'Only university email addresses are allowed.',
            });
          }
        },
        after: async (user) => {
          await prisma.notification.create({
            data: {
              userId: user.id,
              type: NotificationType.SYSTEM,
              title: 'Welcome to Iskommerce',
              message: 'Your account is ready. Start exploring listings.',
            },
          });
        },
      },
    },
  },

  plugins: [
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, ctx) => {
        // Implement sending OTP code via SMS
      },
    }),
  ],
  advanced: {
    cookies: {
      session_token: {
        attributes: {
          sameSite: isProduction ? 'none' : 'lax',
          secure: isProduction,
        },
      },
    },
  },
});
