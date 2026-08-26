ALTER TABLE "TopbarSettings"
  ADD COLUMN IF NOT EXISTS "openHours" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "noteLabel" TEXT NOT NULL DEFAULT 'Note',
  ADD COLUMN IF NOT EXISTS "noteText" TEXT NOT NULL DEFAULT 'Top finance Advisor Service Solution!',
  ADD COLUMN IF NOT EXISTS "showNote" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "socialsTitle" TEXT NOT NULL DEFAULT 'follow us:',
  ADD COLUMN IF NOT EXISTS "showSocials" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "HeaderSettings"
  ADD COLUMN IF NOT EXISTS "showContactCta" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "showSearch" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "callTitle" TEXT NOT NULL DEFAULT 'Get Contact Now',
  ADD COLUMN IF NOT EXISTS "showCall" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "showSidebar" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "sidebarAbout" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "sidebarContactTitle" TEXT NOT NULL DEFAULT 'Contact Us',
  ADD COLUMN IF NOT EXISTS "sidebarNewsletterTitle" TEXT NOT NULL DEFAULT 'Newsletter',
  ADD COLUMN IF NOT EXISTS "showSidebarNewsletter" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "AboutSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#ecf5f4';
ALTER TABLE "ServicesSectionSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#ffffff';
ALTER TABLE "BookAppointmentSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#ecf5f4';
ALTER TABLE "WhyChooseSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#ecf5f4';
ALTER TABLE "TeamSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#ecf5f4';
ALTER TABLE "WorkingProcessSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#ecf5f4';
ALTER TABLE "ProjectsSectionSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#ffffff';
ALTER TABLE "BlogSectionSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#ecf5f4';
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandOneBgColor" SET DEFAULT '#006654';
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandOneTextColor" SET DEFAULT '#ffffff';
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandTwoBgColor" SET DEFAULT '#f5c835';
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandTwoTextColor" SET DEFAULT '#006654';
ALTER TABLE "BlogCategory" ALTER COLUMN "accentColor" SET DEFAULT '#006654';

DO $$
DECLARE
  target RECORD;
  mapping CONSTANT jsonb := '{
    "#e3c9a0": "#f5c835",
    "#5c6b45": "#006654",
    "#3a3020": "#131111",
    "#f4ebd8": "#ecf5f4",
    "#cdae7c": "#dddddd",
    "#6b5b40": "#636363",
    "#fffdf8": "#ffffff",
    "#faf5e9": "#ffffff",
    "#ede0c4": "#e2edec",
    "#a89b80": "#92918f"
  }'::jsonb;
BEGIN
  FOR target IN
    SELECT * FROM (VALUES
      ('AboutSettings', 'taglineBg'),
      ('ServicesSectionSettings', 'taglineBg'),
      ('BookAppointmentSettings', 'taglineBg'),
      ('WhyChooseSettings', 'taglineBg'),
      ('TeamSettings', 'taglineBg'),
      ('WorkingProcessSettings', 'taglineBg'),
      ('ProjectsSectionSettings', 'taglineBg'),
      ('BlogSectionSettings', 'taglineBg'),
      ('MarqueeSettings', 'bandOneBgColor'),
      ('MarqueeSettings', 'bandOneTextColor'),
      ('MarqueeSettings', 'bandTwoBgColor'),
      ('MarqueeSettings', 'bandTwoTextColor'),
      ('BlogCategory', 'accentColor'),
      ('Service', 'accentColor')
    ) AS t(table_name, column_name)
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = target.table_name
        AND column_name = target.column_name
    ) THEN
      EXECUTE format(
        'UPDATE %I SET %I = $1 ->> lower(%I) WHERE $1 ? lower(%I)',
        target.table_name, target.column_name, target.column_name, target.column_name
      ) USING mapping;
    END IF;
  END LOOP;
END $$;
