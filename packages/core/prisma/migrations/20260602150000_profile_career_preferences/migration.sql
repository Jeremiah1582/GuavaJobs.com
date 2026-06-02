-- Profile career preferences (Tier A) + aspiring role + personality type

CREATE TYPE "LanguageProficiency" AS ENUM (
  'BASIC',
  'CONVERSATIONAL',
  'PROFESSIONAL',
  'FLUENT',
  'NATIVE'
);

CREATE TYPE "RightToWorkStatus" AS ENUM (
  'UK_CITIZEN',
  'SETTLED_STATUS',
  'PRE_SETTLED',
  'SKILLED_WORKER',
  'STUDENT_VISA',
  'NEEDS_SPONSORSHIP',
  'OTHER',
  'PREFER_NOT_TO_SAY'
);

CREATE TYPE "SeniorityLevel" AS ENUM (
  'INTERN',
  'JUNIOR',
  'MID',
  'SENIOR',
  'LEAD',
  'EXECUTIVE'
);

CREATE TYPE "RelocationWillingness" AS ENUM (
  'NONE',
  'LOCAL',
  'NATIONAL',
  'INTERNATIONAL'
);

CREATE TYPE "SalaryPeriod" AS ENUM ('ANNUAL', 'MONTHLY', 'HOURLY');

ALTER TABLE "profiles" ADD COLUMN "linkedInUrl" TEXT;
ALTER TABLE "profiles" ADD COLUMN "githubUrl" TEXT;
ALTER TABLE "profiles" ADD COLUMN "aspiringRole" TEXT;
ALTER TABLE "profiles" ADD COLUMN "personalityType" TEXT;
ALTER TABLE "profiles" ADD COLUMN "languagesJson" JSONB;
ALTER TABLE "profiles" ADD COLUMN "salaryCurrency" TEXT DEFAULT 'GBP';
ALTER TABLE "profiles" ADD COLUMN "salaryMin" INTEGER;
ALTER TABLE "profiles" ADD COLUMN "salaryMax" INTEGER;
ALTER TABLE "profiles" ADD COLUMN "salaryPeriod" "SalaryPeriod" DEFAULT 'ANNUAL';
ALTER TABLE "profiles" ADD COLUMN "salaryNegotiable" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "profiles" ADD COLUMN "rightToWork" "RightToWorkStatus";
ALTER TABLE "profiles" ADD COLUMN "rightToWorkNote" TEXT;
ALTER TABLE "profiles" ADD COLUMN "noticePeriodWeeks" INTEGER;
ALTER TABLE "profiles" ADD COLUMN "availableFrom" TIMESTAMP(3);
ALTER TABLE "profiles" ADD COLUMN "targetSeniority" "SeniorityLevel";
ALTER TABLE "profiles" ADD COLUMN "employmentTypePreference" "EmploymentType";
ALTER TABLE "profiles" ADD COLUMN "relocationWillingness" "RelocationWillingness";
