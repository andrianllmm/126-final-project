export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',

  port: Number(process.env.PORT ?? 3000),
  host: process.env.HOST ?? '0.0.0.0',

  baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',

  webUrl: process.env.WEB_URL ?? 'http://localhost:3001',

  databaseUrl: process.env.DATABASE_URL!,
  directUrl: process.env.DIRECT_URL!,

  betterAuthUrl: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',

  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,

  uploadDriver: (process.env.UPLOAD_DRIVER ?? 'local') as 'local' | 's3',

  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',

  s3: {
    region: process.env.S3_REGION ?? 'auto',
    bucket: process.env.S3_BUCKET!,
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    publicUrl: process.env.S3_PUBLIC_URL!,
  },
} as const;
