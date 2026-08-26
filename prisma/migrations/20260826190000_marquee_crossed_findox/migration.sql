ALTER TABLE "MarqueeSettings" ALTER COLUMN "layout" SET DEFAULT 'crossed';
ALTER TABLE "MarqueeSettings" ALTER COLUMN "skewDegrees" SET DEFAULT 7.412;
ALTER TABLE "MarqueeSettings" ALTER COLUMN "fontSizePx" SET DEFAULT 35;
ALTER TABLE "MarqueeSettings" ALTER COLUMN "itemGapPx" SET DEFAULT 30;
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandPaddingPx" SET DEFAULT 32;
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandOneSpeedSeconds" SET DEFAULT 20;
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandTwoSpeedSeconds" SET DEFAULT 20;

UPDATE "MarqueeSettings"
SET "layout" = 'crossed',
    "skewDegrees" = 7.412,
    "fontSizePx" = 35,
    "itemGapPx" = 30,
    "bandPaddingPx" = 32,
    "bandOneSpeedSeconds" = 20,
    "bandTwoSpeedSeconds" = 20
WHERE "id" = 'default';

UPDATE "BlogSectionSettings" SET "taglineBg" = '#ffffff' WHERE "id" = 'default' AND lower("taglineBg") = '#ecf5f4';
