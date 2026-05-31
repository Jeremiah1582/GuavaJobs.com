created_date: 2026-05-30 19:00:00, updated_at: 2026-05-30 19:30:00

# landingpage — guavajobs.com

**Production:** `https://guavajobs.com`  
**Local:** `http://localhost:3000`

Marketing site only. No product database, no Supabase service role, no `/api/v1` business routes.

## Scope

- Landing hero, ICP copy, value props
- Pricing overview (links to app for checkout)
- Legal: Privacy, Terms
- SEO metadata, sitemap
- Footer with link to app

## CTAs

All product links use `NEXT_PUBLIC_APP_URL`:

| CTA | Target |
|-----|--------|
| Browse jobs | `${APP_URL}/jobs` |
| Sign up | `${APP_URL}/sign-up` |
| Sign in | `${APP_URL}/sign-in` |
| Open dashboard | `${APP_URL}/dashboard` |

## Stack (planned)

Next.js (App Router) · TypeScript · Tailwind · shadcn/ui

## Deploy

Vercel project root: **`landingpage`**

See [`../architecture.md`](../architecture.md).
