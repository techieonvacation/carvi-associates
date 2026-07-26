-- CreateTable
CREATE TABLE IF NOT EXISTS "WhyChooseSettings" (
    "id" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "titleLine1" TEXT NOT NULL,
    "titleLine2" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "taglineBg" TEXT NOT NULL DEFAULT '#f4ebd8',
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT 'Why choose Carvi Associates',
    "shapeImageUrl" TEXT NOT NULL DEFAULT '/images/shapes/why-choose-shape-1-1.png',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "canonicalUrl" TEXT,
    "ogImageUrl" TEXT,
    "twitterImageUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhyChooseSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WhyChooseItem" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "href" TEXT NOT NULL DEFAULT '#',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhyChooseItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WhyChooseItem_displayOrder_idx" ON "WhyChooseItem"("displayOrder");
CREATE INDEX IF NOT EXISTS "WhyChooseItem_deletedAt_idx" ON "WhyChooseItem"("deletedAt");
CREATE INDEX IF NOT EXISTS "WhyChooseItem_isVisible_isActive_deletedAt_idx" ON "WhyChooseItem"("isVisible", "isActive", "deletedAt");

-- Seed section settings (idempotent)
INSERT INTO "WhyChooseSettings" (
  "id", "tagline", "titleLine1", "titleLine2", "description", "taglineBg",
  "imageUrl", "imageAlt", "shapeImageUrl", "isVisible", "noIndex", "updatedAt"
)
VALUES (
  'default',
  'Why Choose Us',
  'Consulting Solutions For Your',
  'Business Development.',
  'Business tailored design, management & support services Business business agency elit, sed do eiusmod tempor majority have in some we form, by injected humour solution.',
  '#f4ebd8',
  '/images/resources/why-choose-1-1.jpg',
  'Why choose Carvi Associates',
  '/images/shapes/why-choose-shape-1-1.png',
  true,
  false,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

-- Seed items when empty (idempotent)
INSERT INTO "WhyChooseItem" (
  "id", "icon", "title", "text", "href", "displayOrder",
  "isVisible", "isActive", "createdAt", "updatedAt"
)
SELECT * FROM (
  VALUES
    (
      'seed_why_1',
      'icon-market-research',
      'Market Research Analysis',
      'Financial services provided company.',
      '#',
      0,
      true,
      true,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ),
    (
      'seed_why_2',
      'icon-data-visualization',
      'Data Analysis finance',
      'Business tailored design, management.',
      '#',
      1,
      true,
      true,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ),
    (
      'seed_why_3',
      'icon-advertisig-agency',
      'Digital of Marketing',
      'We need to make the new version clean.',
      '#',
      2,
      true,
      true,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
) AS v("id", "icon", "title", "text", "href", "displayOrder", "isVisible", "isActive", "createdAt", "updatedAt")
WHERE NOT EXISTS (SELECT 1 FROM "WhyChooseItem" LIMIT 1);
