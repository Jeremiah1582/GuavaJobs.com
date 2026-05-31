created_date: 2026-05-30 19:00:00, updated_at: 2026-06-01 18:00:00

# app — app.guavajobs.com

**Production:** `https://app.guavajobs.com`  
**Local:** `http://localhost:3001`

Product application + **canonical REST API** at `/api/v1/*`.

## Quick start

```bash
# From repo root
cp app/.env.example app/.env.local   # Supabase + DATABASE_URL required for auth
npx pnpm@9.15.0 install
npx pnpm@9.15.0 dev:app
```

Health check: `curl http://localhost:3001/api/v1/health`

## Auth (F2)

Email/password sign-up and sign-in via Supabase (`@supabase/ssr`). Copy `app/.env.example` → `.env.local` with:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (sign-in / sessions)
- `DATABASE_URL`, `DIRECT_URL` (Prisma + `npm run db:seed`)
- Optional: `SUPABASE_SERVICE_ROLE_KEY` (account deletion in settings only)
- `DATABASE_URL`, `DIRECT_URL` (Prisma user sync)

**Supabase dashboard → Authentication → URL configuration**

| Setting | Local dev | Production |
|---------|-----------|------------|
| Site URL | `http://localhost:3001` | `https://app.guavajobs.com` |
| Redirect URLs | `http://localhost:3001/auth/callback` | `https://app.guavajobs.com/auth/callback` |
| | `http://localhost:3001/reset-password` | `https://app.guavajobs.com/reset-password` |

**Email confirmation:** when enabled in Supabase, sign-up does not create a session until the user clicks the confirmation link. They land on `/sign-up/confirm-email` and must confirm before password sign-in works.

| Route | Purpose |
|-------|---------|
| `/sign-in`, `/sign-up` | Email/password auth; supports `?next=` redirect |
| `/sign-up/confirm-email` | Post sign-up “check your inbox” + resend confirmation |
| `/forgot-password`, `/reset-password` | Password reset via email link |
| `/auth/callback` | PKCE/code exchange + Prisma user sync |
| `/settings` | Email, sign out, GDPR delete account |

## Route access (F5)

Middleware enforces auth using lists in [`src/lib/auth/routes.ts`](src/lib/auth/routes.ts).

| Access | Paths |
|--------|-------|
| **Public** | `/`, `/jobs`, `/jobs/*`, `/sign-in`, `/sign-up`, `/sign-up/confirm-email`, `/forgot-password`, `/reset-password`, `/auth/callback`, `/api/v1/health`, `/api/v1/jobs`, `/api/v1/jobs/*` |
| **Protected** | `/dashboard`, `/profile`, `/settings`, `/applications/*` |

- Unauthenticated visit to a protected path → `/sign-in?next=<path>`
- Authenticated visit to sign-in/up/forgot-password → `next` query if safe, else `/dashboard`
- Job **Track** flow uses `?next=/jobs/{id}?track=1` (not `returnUrl`); auth forms also accept `returnUrl` as a legacy alias

## Profile (F6)

| Route / API | Purpose |
|-------------|---------|
| `/profile` | Experience, skills, education, job quiz, CV paste helper, optional file upload |
| `GET /api/v1/profile` | Session required — returns profile + completeness |
| `PATCH /api/v1/profile` | Session required — partial update via `profileService` |

**CV storage (optional):** create a private Supabase Storage bucket named `cv-uploads` with RLS so authenticated users can upload only under `{userId}/*`. Upload uses the publishable key + user session (no service role required for upload). If the bucket is missing, paste-from-text still works.

## Routes

| Path | Status |
|------|--------|
| `/` | Hub home |
| `/jobs`, `/jobs/[id]` | F4 job board; track flow (F5) |
| `/sign-in`, `/sign-up`, `/settings` | F2 auth (live) |
| `/dashboard` | F5 tracker home (auth required) |
| `/profile` | F6 profile builder (auth required) |
| `/applications/new` | F5 manual job entry (auth required) |
| `/api/v1/health` | Live — `{ data: { status, version, db? } }` |
| `/api/v1/profile` | F6 — GET/PATCH (auth required) |

## Stack

Next.js 16 · React 19 · Tailwind v4 · shadcn (new-york) · `@guavajobs/core` · Supabase SSR · Sonner

Production build uses `next build --webpack` (Turbopack production build has monorepo chunk issues with `@guavajobs/core`).

## Brand tokens

Pink primary / green secondary palette lives in [`../shared/guava-tokens.css`](../shared/guava-tokens.css), imported by [`src/app/globals.css`](src/app/globals.css). Use `bg-guava-pink-gradient` for primary CTAs, `text-guava-green` for secondary accents, and `--accent` (mapped to pink) for links and focus rings.

## Env

See [`app/.env.example`](./.env.example). Legal links use `NEXT_PUBLIC_LANDING_URL` (marketing domain).

`DATABASE_URL` and `DIRECT_URL` in `.env.local` are used by Prisma in `packages/core` when you run from the repo root:

```bash
npm run db:push    # from repo root (loads this file’s DATABASE_URL / DIRECT_URL)
npm run db:generate
npm run db:seed    # SEED_USER_EMAIL + SEED_USER_PASSWORD (uses DATABASE_URL / DIRECT_URL only)
```

For auth E2E testing, prefer normal sign-up with email confirmation. `db:seed` creates a confirmed dev user (`email_confirmed_at` set) for sample applications only.

## Deploy

Vercel root directory: **`app`** — see [`../docs/DEPLOY.md`](../docs/DEPLOY.md).
