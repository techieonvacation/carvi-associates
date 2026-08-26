ALTER TABLE "TeamSettings" ALTER COLUMN "backgroundImageUrl" SET DEFAULT '';

UPDATE "TeamSettings"
SET "backgroundImageUrl" = ''
WHERE "backgroundImageUrl" = '/images/backgrounds/team-bg-2-1.jpg';
