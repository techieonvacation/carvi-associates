ALTER TABLE "ContactSettings"
  ADD COLUMN IF NOT EXISTS "messageLabel" TEXT NOT NULL DEFAULT 'Your Message';

ALTER TABLE "BlogSectionSettings"
  DROP COLUMN IF EXISTS "showNewsletter";
