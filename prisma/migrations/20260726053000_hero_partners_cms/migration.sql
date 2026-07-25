-- AlterTable: extend HeroSettings with CMS fields previously hardcoded in home-data
ALTER TABLE "HeroSettings" ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT 'Expertise in Audit, Tax, Compliance & Advisory to help you stay compliant, reduce risks and scale your business.';
ALTER TABLE "HeroSettings" ADD COLUMN IF NOT EXISTS "secondaryCtaText" TEXT NOT NULL DEFAULT 'Talk to an Expert';
ALTER TABLE "HeroSettings" ADD COLUMN IF NOT EXISTS "stats" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "HeroSettings" ADD COLUMN IF NOT EXISTS "trust" JSONB NOT NULL DEFAULT '[]';

-- Backfill empty stats/trust from former static homepage content (safe for existing rows)
UPDATE "HeroSettings"
SET
  "stats" = '[
    {"icon":"icon-trophy","end":24,"suffix":"+","label":"Years Experience"},
    {"icon":"icon-business-and-finance","end":500,"suffix":"+","label":"Businesses Served"},
    {"icon":"icon-analytics","end":50,"suffix":"+","label":"Industries"},
    {"icon":"icon-folder","end":1000,"suffix":"+","label":"Returns Filed"}
  ]'::jsonb
WHERE "id" = 'default'
  AND (
    "stats" = '[]'::jsonb
    OR "stats" IS NULL
  );

UPDATE "HeroSettings"
SET
  "trust" = '[
    {"icon":"icon-satisfaction","label":"Chartered Accountants"},
    {"icon":"icon-analysis","label":"Audit · Tax · Compliance"},
    {"icon":"icon-location","label":"Pan-India Advisory"}
  ]'::jsonb
WHERE "id" = 'default'
  AND (
    "trust" = '[]'::jsonb
    OR "trust" IS NULL
  );

-- CreateTable
CREATE TABLE IF NOT EXISTS "PartnerMarqueeSettings" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerMarqueeSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "logoUrl" TEXT,
    "variant" TEXT NOT NULL DEFAULT 'default',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Partner_sortOrder_idx" ON "Partner"("sortOrder");
