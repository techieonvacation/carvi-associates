ALTER TABLE "AboutSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#f4ebd8';
ALTER TABLE "ServicesSectionSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#fffdf8';
ALTER TABLE "BookAppointmentSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#f4ebd8';
ALTER TABLE "WhyChooseSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#f4ebd8';
ALTER TABLE "TeamSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#fffdf8';
ALTER TABLE "ContactSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#fffdf8';
ALTER TABLE "WorkingProcessSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#f4ebd8';
ALTER TABLE "BlogSectionSettings" ALTER COLUMN "taglineBg" SET DEFAULT '#f4ebd8';
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandOneBgColor" SET DEFAULT '#5c6b45';
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandOneTextColor" SET DEFAULT '#fffdf8';
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandTwoBgColor" SET DEFAULT '#e3c9a0';
ALTER TABLE "MarqueeSettings" ALTER COLUMN "bandTwoTextColor" SET DEFAULT '#5c6b45';
ALTER TABLE "BlogCategory" ALTER COLUMN "accentColor" SET DEFAULT '#5c6b45';
ALTER TABLE "SeoSettings" ALTER COLUMN "maskIconColor" SET DEFAULT '#5c6b45';
ALTER TABLE "SeoSettings" ALTER COLUMN "themeColorLight" SET DEFAULT '#faf5e9';
ALTER TABLE "SeoSettings" ALTER COLUMN "themeColorDark" SET DEFAULT '#211c13';
ALTER TABLE "SeoSettings" ALTER COLUMN "manifestBackgroundColor" SET DEFAULT '#faf5e9';

DO $$
DECLARE
  target RECORD;
  palette CONSTANT jsonb := '{
    "#006654": "#5c6b45",
    "#f5c835": "#e3c9a0",
    "#131111": "#3a3020",
    "#ecf5f4": "#f4ebd8",
    "#e2edec": "#ede0c4",
    "#dddddd": "#cdae7c",
    "#636363": "#6b5b40",
    "#92918f": "#958668",
    "#ffffff": "#fffdf8",
    "#0b1f1b": "#211c13"
  }'::jsonb;
  page CONSTANT jsonb := '{
    "#ffffff": "#faf5e9"
  }'::jsonb;
BEGIN
  FOR target IN
    SELECT * FROM (VALUES
      ('AboutSettings', 'taglineBg', palette),
      ('ServicesSectionSettings', 'taglineBg', palette),
      ('BookAppointmentSettings', 'taglineBg', palette),
      ('WhyChooseSettings', 'taglineBg', palette),
      ('TeamSettings', 'taglineBg', palette),
      ('ContactSettings', 'taglineBg', palette),
      ('WorkingProcessSettings', 'taglineBg', palette),
      ('BlogSectionSettings', 'taglineBg', palette),
      ('MarqueeSettings', 'bandOneBgColor', palette),
      ('MarqueeSettings', 'bandOneTextColor', palette),
      ('MarqueeSettings', 'bandTwoBgColor', palette),
      ('MarqueeSettings', 'bandTwoTextColor', palette),
      ('BlogCategory', 'accentColor', palette),
      ('Service', 'accentColor', palette),
      ('SeoSettings', 'maskIconColor', palette),
      ('SeoSettings', 'themeColorDark', palette),
      ('SeoSettings', 'themeColorLight', page),
      ('SeoSettings', 'manifestBackgroundColor', page)
    ) AS t(table_name, column_name, mapping)
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
      ) USING target.mapping;
    END IF;
  END LOOP;
END $$;
