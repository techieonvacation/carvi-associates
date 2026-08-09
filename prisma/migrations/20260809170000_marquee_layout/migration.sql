-- AlterTable
ALTER TABLE "MarqueeSettings"
  ADD COLUMN IF NOT EXISTS "layout" TEXT NOT NULL DEFAULT 'stacked';

ALTER TABLE "MarqueeSettings" ALTER COLUMN "skewDegrees" SET DEFAULT 1.5;
ALTER TABLE "MarqueeSettings" ALTER COLUMN "fontSizePx" SET DEFAULT 26;
ALTER TABLE "MarqueeSettings" ALTER COLUMN "itemGapPx" SET DEFAULT 28;
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandPaddingPx" SET DEFAULT 22;

-- Retune the seeded row to the new stacked design. Scoped to the exact
-- previous defaults so any value an editor deliberately changed is preserved.
UPDATE "MarqueeSettings"
SET "skewDegrees" = 1.5
WHERE "id" = 'default' AND "skewDegrees" = 7.412;

UPDATE "MarqueeSettings"
SET "fontSizePx" = 26
WHERE "id" = 'default' AND "fontSizePx" = 35;

UPDATE "MarqueeSettings"
SET "itemGapPx" = 28
WHERE "id" = 'default' AND "itemGapPx" = 30;

UPDATE "MarqueeSettings"
SET "bandPaddingPx" = 22
WHERE "id" = 'default' AND "bandPaddingPx" = 32;
