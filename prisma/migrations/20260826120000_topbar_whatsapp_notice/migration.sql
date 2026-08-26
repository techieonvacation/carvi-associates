ALTER TABLE "TopbarSettings"
  ADD COLUMN IF NOT EXISTS "whatsappIntroText" TEXT NOT NULL DEFAULT 'For more updates follow 👉',
  ADD COLUMN IF NOT EXISTS "whatsappLinkText" TEXT NOT NULL DEFAULT 'CARVI AND ASSOCIATES on Whatsapp';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'TopbarSettings' AND column_name = 'whatsappMarqueeText'
  ) THEN
    EXECUTE 'UPDATE "TopbarSettings" SET "whatsappIntroText" = "whatsappMarqueeText" WHERE length("whatsappMarqueeText") BETWEEN 1 AND 120';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'TopbarSettings' AND column_name = 'showWhatsappMarquee'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'TopbarSettings' AND column_name = 'showWhatsappNotice'
  ) THEN
    ALTER TABLE "TopbarSettings" RENAME COLUMN "showWhatsappMarquee" TO "showWhatsappNotice";
  END IF;
END $$;

UPDATE "TopbarSettings"
SET "whatsappLinkText" = "whatsappLabel"
WHERE length("whatsappLabel") BETWEEN 1 AND 120;

ALTER TABLE "TopbarSettings"
  ADD COLUMN IF NOT EXISTS "showWhatsappNotice" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "TopbarSettings"
  DROP COLUMN IF EXISTS "whatsappMarqueeText",
  DROP COLUMN IF EXISTS "whatsappMarqueeSpeed";
