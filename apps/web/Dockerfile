FROM node:20-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate
WORKDIR /app

FROM base AS prepare
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker

FROM base AS builder
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY --from=prepare /app/out/full/ .
RUN pnpm turbo build --filter @repo/api
RUN pnpm turbo build --filter=web

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD node apps/web/server.js
