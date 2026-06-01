-- CreateEnum
CREATE TYPE "ApplicationRejectionPhase" AS ENUM ('PRE_INTERVIEW', 'POST_INTERVIEW');

-- AlterTable: new columns
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "rejectionPhase" "ApplicationRejectionPhase";
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "rejectedAt" TIMESTAMP(3);
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "jobUrl" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "source" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "salaryText" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "nextStep" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "contactName" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "viaRecruiter" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "fitScore" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "industry" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "requirementsNotes" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "aboutNotes" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "language" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "roleStartDate" TIMESTAMP(3);
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "interviewRound" INTEGER;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "interviewScheduledAt" TIMESTAMP(3);
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "interviewLocation" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "interviewUrl" TEXT;

-- Migrate legacy REJECTED status (before enum swap)
UPDATE "applications"
SET
  "rejectionPhase" = CASE
    WHEN "interviewRound" IS NOT NULL THEN 'POST_INTERVIEW'::"ApplicationRejectionPhase"
    ELSE 'PRE_INTERVIEW'::"ApplicationRejectionPhase"
  END,
  "rejectedAt" = COALESCE("rejectedAt", NOW()),
  "status" = CASE
    WHEN "interviewRound" IS NOT NULL THEN 'INTERVIEW'::"ApplicationStatus"
    ELSE 'WAITING'::"ApplicationStatus"
  END
WHERE "status"::text = 'REJECTED';

-- Remove REJECTED from ApplicationStatus enum (PostgreSQL)
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'APPLIED', 'WAITING', 'INTERVIEW', 'OFFER', 'ACCEPTED');
ALTER TABLE "applications"
  ALTER COLUMN "status" TYPE "ApplicationStatus"
  USING ("status"::text::"ApplicationStatus");
DROP TYPE "ApplicationStatus_old";
