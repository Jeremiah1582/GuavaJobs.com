-- Profile enrichment + identity display name (URL import, avatar, location)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "displayName" TEXT;

ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "headline" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "websiteUrl" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "lastImportedAt" TIMESTAMP(3);
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "lastImportSourceUrl" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "importMetaJson" JSONB;
