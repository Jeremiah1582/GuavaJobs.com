-- Contact details: phone and structured postal address
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "addressLine1" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "addressLine2" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "region" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "country" TEXT;
