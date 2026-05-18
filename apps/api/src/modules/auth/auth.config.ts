import { APIError, betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../../config/env.js';
import { ALLOWED_EMAIL_DOMAINS } from '@repo/api';

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
      },
    },
  },

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
