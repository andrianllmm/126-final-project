export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',

  port: Number(process.env.PORT ?? 3000),

  host: process.env.HOST ?? '0.0.0.0',

  webUrl: process.env.WEB_URL ?? 'http://localhost:3001',

  databaseUrl: process.env.DATABASE_URL as string,

  directUrl: process.env.DIRECT_URL as string,

  betterAuthUrl: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
} as const;
