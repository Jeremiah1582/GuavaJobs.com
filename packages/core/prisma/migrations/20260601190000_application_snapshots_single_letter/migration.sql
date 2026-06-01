-- FA.1: structured job snapshot + canonical JD text
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "jobListingSnapshot" JSONB;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "jobDescriptionText" TEXT;

UPDATE "applications"
SET "jobDescriptionText" = "jobDescriptionSnapshot"
WHERE "jobDescriptionText" IS NULL
  AND "jobDescriptionSnapshot" IS NOT NULL;

-- FA.2: profile snapshot at track (backfilled lazily in app for existing rows)
CREATE TABLE IF NOT EXISTS "application_profile_snapshots" (
    "applicationId" UUID NOT NULL,
    "summary" TEXT,
    "experienceJson" JSONB,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "educationJson" JSONB,
    "snapshotAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_profile_snapshots_pkey" PRIMARY KEY ("applicationId")
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'application_profile_snapshots_applicationId_fkey'
  ) THEN
    ALTER TABLE "application_profile_snapshots"
      ADD CONSTRAINT "application_profile_snapshots_applicationId_fkey"
      FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- F9.0: one cover letter per application
WITH ranked AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "applicationId"
      ORDER BY "updatedAt" DESC, "id" DESC
    ) AS rn
  FROM "cover_letters"
)
DELETE FROM "cover_letters"
WHERE "id" IN (SELECT "id" FROM ranked WHERE rn > 1);

DROP INDEX IF EXISTS "cover_letters_applicationId_idx";

CREATE UNIQUE INDEX IF NOT EXISTS "cover_letters_applicationId_key" ON "cover_letters"("applicationId");
