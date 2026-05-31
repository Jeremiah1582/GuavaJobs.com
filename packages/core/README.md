created_date: 2026-05-30 19:00:00, updated_at: 2026-05-31 22:30:00

# @guavajobs/core

Shared backend package — **imported by `app/` only**, not by `landingpage/`.

## Purpose

- Single source of truth for business logic
- Enables **API-first** design: Route Handlers delegate here; future B2B clients hit the same services via HTTP
- Shared validators, types, and DB access

## Target structure

```
packages/core/
├── src/
│   ├── services/
│   │   ├── applications.ts
│   │   ├── cover-letters.ts
│   │   ├── profile.ts
│   │   ├── jobs.ts          # Adzuna proxy + cache
│   │   ├── usage.ts         # AI quota (5/month free)
│   │   └── billing.ts
│   ├── db/
│   ├── validators/
│   ├── types/
│   └── auth/
│       ├── session.ts
│       └── api-keys.ts      # Future partner integrations
├── package.json
└── tsconfig.json
```

## Rules

1. **No React** imports in this package.
2. **No HTTP** (Request/Response) — services accept typed inputs and return typed outputs or throw domain errors.
3. App maps domain errors → HTTP status codes in `/api/v1/*` only.

See [`../../architecture.md`](../../architecture.md).

## Database (Prisma + Supabase Postgres)

Schema: [`prisma/schema.prisma`](./prisma/schema.prisma). All DB access goes through `getDb()` in `src/db/`.

```bash
# From repo root — DATABASE_URL and DIRECT_URL live in app/.env.local
# (scripts load app/.env.local automatically)
npm run db:push      # dev schema sync
npm run db:generate
npm run db:seed      # dev user + sample apps (SEED_* in app/.env.local)

# Or from packages/core:
cd packages/core && npm run db:push

# If you use pnpm (corepack enable && corepack prepare pnpm@9.15.0 --activate):
pnpm db:push:pnpm
```

Raw `npx prisma` in `packages/core` does **not** load `app/.env.local` unless you use the scripts above or symlink — see [`.env.example`](./.env.example).

Server-side Supabase admin: `createSupabaseAdmin()` in `src/db/supabase.ts` (requires `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`). Browser auth client lives in `app/src/lib/supabase/client.ts` (F2).
