ALTER TABLE "TeamSettings"
  ADD COLUMN IF NOT EXISTS "backgroundImageUrl" TEXT NOT NULL DEFAULT '/images/backgrounds/team-bg-2-1.jpg',
  ADD COLUMN IF NOT EXISTS "backgroundImageAlt" TEXT NOT NULL DEFAULT '';

ALTER TABLE "TeamSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#ffffff';

UPDATE "TeamSettings" SET "taglineBg" = '#ffffff' WHERE lower("taglineBg") IN ('#ecf5f4', '#f4ebd8');
