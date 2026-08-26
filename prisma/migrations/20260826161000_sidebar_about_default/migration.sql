ALTER TABLE "HeaderSettings"
  ALTER COLUMN "sidebarAbout"
  SET DEFAULT 'Carvi Associates is a Chartered Accountancy firm delivering audit, taxation, GST, compliance and advisory services that keep Indian businesses compliant and ready to scale.';

UPDATE "HeaderSettings"
SET "sidebarAbout" = 'Carvi Associates is a Chartered Accountancy firm delivering audit, taxation, GST, compliance and advisory services that keep Indian businesses compliant and ready to scale.'
WHERE "sidebarAbout" = '';
