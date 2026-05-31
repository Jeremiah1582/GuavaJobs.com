created_date: 2026-05-30 20:00:00, updated_at: 2026-05-30 20:00:00

# Deploying GuavaJobs (Vercel)

Two separate Vercel projects serve the monorepo. Each project sets a **Root Directory** so builds target the correct Next.js app.

## Projects

| Vercel project | Root directory | Domain | Build command (from repo root) |
|----------------|----------------|--------|--------------------------------|
| Marketing | `landingpage` | guavajobs.com | `pnpm build:landing` |
| Product | `app` | app.guavajobs.com | `pnpm build:app` |

## Monorepo install

In each Vercel project **Settings → General**:

- **Install Command:** `cd ../.. && pnpm install` (when root directory is `landingpage` or `app`)
- Or set the Vercel **Root Directory** and use **Install Command:** `pnpm install` with **Root Directory** at the repository root and override **Build Command** per project.

Recommended: Root Directory = `landingpage` or `app`, Install Command = `cd ../.. && pnpm install`.

## Environment variables

Copy from each package’s `.env.example`:

- **landingpage:** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`
- **app:** `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_LANDING_URL`, `DATABASE_URL`, `DIRECT_URL`, Supabase keys

Run Prisma against your Supabase Postgres from your machine or CI:

```bash
pnpm --filter @guavajobs/core db:generate
pnpm --filter @guavajobs/core db:push   # dev only — use migrate for production
```

Set `DATABASE_URL` and `DIRECT_URL` on the **app** Vercel project (and locally in `app/.env.local`).

## DNS

- `guavajobs.com` → marketing project
- `app.guavajobs.com` → product project

## Local parity

```bash
pnpm install
pnpm dev:landing   # :3000
pnpm dev:app       # :3001
```

Point `landingpage/.env.local` `NEXT_PUBLIC_APP_URL` to `http://localhost:3001` and `app/.env.local` `NEXT_PUBLIC_LANDING_URL` to `http://localhost:3000`.

## API

External clients use `https://app.guavajobs.com/api/v1/*`. Health check: `GET /api/v1/health`.
