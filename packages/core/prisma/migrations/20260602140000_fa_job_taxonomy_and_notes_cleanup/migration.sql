-- FA.4: job category + employment type on applications
CREATE TYPE "JobCategory" AS ENUM ('ENGINEERING', 'PRODUCT', 'DESIGN', 'DATA', 'OTHER', 'UNKNOWN');
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'UNKNOWN');

ALTER TABLE "applications" ADD COLUMN "jobCategory" "JobCategory" NOT NULL DEFAULT 'UNKNOWN';
ALTER TABLE "applications" ADD COLUMN "jobCategoryOther" TEXT;
ALTER TABLE "applications" ADD COLUMN "employmentType" "EmploymentType" NOT NULL DEFAULT 'UNKNOWN';

-- FA.5: legacy free-text notes column (timeline uses application_notes)
ALTER TABLE "applications" DROP COLUMN IF EXISTS "notes";
