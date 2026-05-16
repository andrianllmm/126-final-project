import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../../config/env.js';

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

  trustedOrigins: [env.webUrl],

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
