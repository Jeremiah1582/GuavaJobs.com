-- CreateEnum
CREATE TYPE "CoverLetterSource" AS ENUM ('MANUAL', 'AI');

-- CreateTable
CREATE TABLE "cover_letters" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "source" "CoverLetterSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cover_letters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cover_letters_applicationId_idx" ON "cover_letters"("applicationId");

-- AddForeignKey
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
