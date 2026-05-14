import 'dotenv/config';
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';
import { resolve } from 'path';

config({ path: resolve(__dirname, '.env') });

const directUrl = process.env.DIRECT_URL;

if (!directUrl) {
  throw new Error('DIRECT_URL is not set');
}
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: directUrl,
  },
});
