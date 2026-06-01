created_date: 2026-06-01 12:00:00, updated_at: 2026-06-01 20:30:00

# Database baseline (P3005)

Supabase databases created with `db push` or manual SQL often have **no** `_prisma_migrations` history. Running `prisma migrate deploy` then fails with **P3005** (database not empty). Until the application tracker migration is applied and recorded, Prisma queries that select new `applications` columns can fail at runtime.

## Steps

### 1. Apply migration SQL in Supabase

1. Open the **Supabase SQL editor** for your project (use staging first if available).
2. Review and run the SQL from:

   `packages/core/prisma/migrations/20260601120000_application_tracker_fields/migration.sql`

   That migration adds application tracker fields, migrates legacy `REJECTED` status, and updates the `ApplicationStatus` enum.

### 2. Mark the migration as applied (do not re-run SQL)

From the repository root:

```bash
npx pnpm@9.15.0 --filter @guavajobs/core exec node scripts/prisma-with-app-env.mjs migrate resolve --applied 20260601120000_application_tracker_fields
```

This records the migration in `_prisma_migrations` without executing it again.

### 3. Verify

```bash
npx pnpm@9.15.0 --filter @guavajobs/core run db:migrate:status
```

Status should show the migration as applied and the database in sync.

## Notes

- Prisma CLI must see `DATABASE_URL` and `DIRECT_URL` from **`app/.env.local`**. Do not run bare `prisma migrate …` under `packages/core` — use `db:migrate:*` scripts (they load app env via `scripts/prisma-with-app-env.mjs`).
- Use `npx pnpm@9.15.0` so a global `pnpm` install is not required.
- **Local-only alternative:** `prisma db push` syncs schema without migration history — not recommended for production.
- After baseline, `migrate deploy` should succeed for future migrations.

## F8 — `cover_letters` table

If `cover_letters` is missing after the tracker baseline, apply:

`packages/core/prisma/migrations/20260601180000_cover_letters/migration.sql`

Then mark applied:

```bash
npx pnpm@9.15.0 --filter @guavajobs/core exec node scripts/prisma-with-app-env.mjs migrate resolve --applied 20260601180000_cover_letters
```

Skip creating `CoverLetterSource` or the table if they already exist from `db push` (adjust SQL manually).

## FA + F9 — snapshots and single letter

Apply in order if not yet on Supabase:

1. `packages/core/prisma/migrations/20260601190000_application_snapshots_single_letter/migration.sql`
2. `packages/core/prisma/migrations/20260601200000_cover_letter_citations/migration.sql`

Then mark each applied:

```bash
npx pnpm@9.15.0 --filter @guavajobs/core exec prisma migrate resolve --applied 20260601190000_application_snapshots_single_letter
npx pnpm@9.15.0 --filter @guavajobs/core exec prisma migrate resolve --applied 20260601200000_cover_letter_citations
```

## FA / F9.0 — application snapshots + single cover letter

After `cover_letters` exists, apply:

`packages/core/prisma/migrations/20260601190000_application_snapshots_single_letter/migration.sql`

Adds `jobListingSnapshot`, `jobDescriptionText`, `application_profile_snapshots`, and a **unique** constraint on `cover_letters.applicationId` (dedupes existing rows first).

Then mark applied:

```bash
npx pnpm@9.15.0 --filter @guavajobs/core exec node scripts/prisma-with-app-env.mjs migrate resolve --applied 20260601190000_application_snapshots_single_letter
```
