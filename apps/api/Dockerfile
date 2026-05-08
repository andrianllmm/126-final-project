FROM node:20-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate
WORKDIR /app

FROM base AS prepare
RUN npm install -g turbo
COPY . .
RUN turbo prune api --docker

FROM base AS builder
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY --from=prepare /app/out/full/ .
RUN pnpm turbo db:generate --filter=api
RUN pnpm turbo build --filter @repo/api
RUN pnpm turbo build --filter=api

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts

WORKDIR /app/apps/api

CMD sh -c "pnpm prisma migrate deploy --config ./prisma.config.ts && node dist/src/main.js"
