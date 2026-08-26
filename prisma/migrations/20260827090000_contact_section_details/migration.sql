ALTER TABLE "ContactSettings"
  ADD COLUMN IF NOT EXISTS "phoneText" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "phoneHref" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "showPhone" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "emailText" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "showEmail" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "locationText" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "locationUrl" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "showLocation" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "nameLabel" TEXT NOT NULL DEFAULT 'Your Name *',
  ADD COLUMN IF NOT EXISTS "companyLabel" TEXT NOT NULL DEFAULT 'Company Name',
  ADD COLUMN IF NOT EXISTS "emailLabel" TEXT NOT NULL DEFAULT 'Your Mail *',
  ADD COLUMN IF NOT EXISTS "mobileLabel" TEXT NOT NULL DEFAULT 'Your Mobile *',
  ADD COLUMN IF NOT EXISTS "locationLabel" TEXT NOT NULL DEFAULT 'Your Location *',
  ADD COLUMN IF NOT EXISTS "sideImageUrl" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "sideImageAlt" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "showSideImage" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "showShape" BOOLEAN NOT NULL DEFAULT true;

UPDATE "ContactSettings" c
SET "phoneText" = COALESCE(NULLIF(t."phone", ''), c."phoneText"),
    "phoneHref" = COALESCE(NULLIF(t."phoneHref", ''), c."phoneHref"),
    "emailText" = COALESCE(NULLIF(t."email", ''), c."emailText"),
    "locationText" = COALESCE(NULLIF(t."address", ''), c."locationText"),
    "locationUrl" = COALESCE(NULLIF(t."addressMapUrl", ''), c."locationUrl")
FROM "TopbarSettings" t
WHERE c."id" = 'default' AND t."id" = 'default';
