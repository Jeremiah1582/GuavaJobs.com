created_date: 2026-06-01 12:00:00, updated_at: 2026-06-01 15:30:00

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
npx pnpm@9.15.0 --filter @guavajobs/core exec prisma migrate resolve --applied 20260601120000_application_tracker_fields
```

This records the migration in `_prisma_migrations` without executing it again.

### 3. Verify

```bash
npx pnpm@9.15.0 --filter @guavajobs/core db:migrate:status
```

Status should show the migration as applied and the database in sync.

## Notes

- Use `npx pnpm@9.15.0` so a global `pnpm` install is not required.
- **Local-only alternative:** `prisma db push` syncs schema without migration history — not recommended for production.
- After baseline, `migrate deploy` should succeed for future migrations.
