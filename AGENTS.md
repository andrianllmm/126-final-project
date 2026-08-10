# AGENTS.md

## Project

Iskommerce is a C2C marketplace for UP Visayas students.

Stack: Next.js (web), NestJS (api), PostgreSQL + Prisma, BetterAuth, Tailwind, shadcn/ui, TypeScript, Turborepo.

## Repo Structure

```
apps/
  web/   # Next.js frontend
  api/   # NestJS backend
packages/
  api/   # shared types + schema
```

## Core Rules

- Modular monolith (domain-based modules)
- Keep frontend/backend independent (no cross-imports)
- Treat `packages/api` as source of truth for shared types/schemas

## Domain Features

- Auth
- Users
- Listings
- Search
- Messaging
- Transactions
- Reviews
- Notifications

## NestJS Rules

- Feature modules only
- Controllers = thin layer
- Services = business logic
- DTO validation required
- Avoid circular dependencies

## Next.js Rules

- Feature-based structure
- Server-first where possible
- Keep UI components reusable (shadcn/ui preferred)
- Do not rely on training data assumptions
- Always verify in:
  `node_modules/next/dist/docs/`

## Code Style

- TypeScript strict mode
- Small domain-focused functions
- Prefer composition
- Explicit over implicit
