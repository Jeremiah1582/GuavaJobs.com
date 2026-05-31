created_date: 2026-05-30 19:00:00, updated_at: 2026-06-01 18:00:00

# GuavaJobs

Monorepo for the GuavaJobs career hub — two Next.js apps + shared backend packages.

| Path | Domain | Purpose |
|------|--------|---------|
| [`landingpage/`](./landingpage/) | **guavajobs.com** | Marketing, pricing, legal, SEO |
| [`app/`](./app/) | **app.guavajobs.com** | Product UI + **REST API** (`/api/v1/*`) |
| [`packages/core/`](./packages/core/) | — | Shared business logic, DB, types (API-first) |

**Docs:** [`projectVision.md`](./projectVision.md) · [`masterBuildPlan.md`](./masterBuildPlan.md) · [`architecture.md`](./architecture.md)

## Brand tokens

Both apps share the Guava fruit palette via [`shared/guava-tokens.css`](./shared/guava-tokens.css). **Pink** (`--guava-pink`, hue ~12) is the primary brand colour — flesh tones for CTAs, links, and `--accent`. **Green** (`--guava-green`, hue ~152) is the secondary accent — skin/leaves for badges, borders, and success hints. Use single-hue gradient utilities (`bg-guava-pink-gradient`, `bg-guava-green-gradient`, `bg-section-pink`, `bg-section-green`); never blend pink and green on the same surface. Tailwind classes: `text-guava-pink`, `bg-guava-green/10`, etc.

## Local development (target)

```bash
# From repo root (requires pnpm 9 — enable via corepack or npx pnpm@9.15.0)
pnpm install
pnpm dev:landing   # http://localhost:3000 → landingpage/
pnpm dev:app       # http://localhost:3001 → app/
```

Copy env examples:

- [`landingpage/.env.example`](landingpage/.env.example) → `landingpage/.env.local`
- [`app/.env.example`](app/.env.example) → `app/.env.local` (includes `DATABASE_URL`, Supabase keys)

```bash
pnpm db:generate   # Prisma client in @guavajobs/core
```

## Deploy

See [`docs/DEPLOY.md`](docs/DEPLOY.md) for two Vercel projects:

- **guavajobs.com** → root directory `landingpage`
- **app.guavajobs.com** → root directory `app`

API consumers (bootcamps, client HR software) integrate with `https://app.guavajobs.com/api/v1/*`.
