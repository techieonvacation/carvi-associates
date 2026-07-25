-- CreateTable
CREATE TABLE IF NOT EXISTS "Feature" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "href" TEXT NOT NULL DEFAULT '#',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Feature_sortOrder_idx" ON "Feature"("sortOrder");

-- CreateTable
CREATE TABLE IF NOT EXISTS "AboutSettings" (
    "id" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "titleLine1" TEXT NOT NULL,
    "titleLine2" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "experienceValue" TEXT NOT NULL,
    "experienceLabel" TEXT NOT NULL,
    "collageOneUrl" TEXT NOT NULL,
    "collageTwoUrl" TEXT NOT NULL,
    "collageOneAlt" TEXT NOT NULL DEFAULT 'Advisors reviewing a financial plan',
    "collageTwoAlt" TEXT NOT NULL DEFAULT 'Client consultation in progress',
    "defaultTabId" TEXT,
    "taglineBg" TEXT NOT NULL DEFAULT '#f4ebd8',
    "tabs" JSONB NOT NULL DEFAULT '[]',
    "checklist" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutSettings_pkey" PRIMARY KEY ("id")
);

-- Seed default AboutSettings from former static homepage content (idempotent)
INSERT INTO "AboutSettings" (
  "id",
  "tagline",
  "titleLine1",
  "titleLine2",
  "text",
  "experienceValue",
  "experienceLabel",
  "collageOneUrl",
  "collageTwoUrl",
  "collageOneAlt",
  "collageTwoAlt",
  "defaultTabId",
  "taglineBg",
  "tabs",
  "checklist",
  "updatedAt"
)
VALUES (
  'default',
  'Our About Company',
  'We Provide Professional Advice',
  'About This Finance.',
  'Business tailored design, management & support services Business business agency elit, sed do eiusmod tempor majority have in some we form, by injected humour solution.',
  '37+',
  'Years Experience',
  '/images/about/about-1-1.jpg',
  '/images/about/about-1-2.jpg',
  'Advisors reviewing a financial plan',
  'Client consultation in progress',
  'team-support',
  '#f4ebd8',
  '[
    {"id":"data-analysis","label":"Data Analysis","image":"/images/about/about-1-3.jpg"},
    {"id":"team-support","label":"Team Support","image":"/images/about/about-1-4.jpg"},
    {"id":"advertising","label":"Advertising","image":"/images/about/about-1-5.jpg"}
  ]'::jsonb,
  '[
    "Experienced & Skilled Team.",
    "Financial Audit Business Files.",
    "Lending & Credit Services."
  ]'::jsonb,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

-- Seed default Features when table is empty (idempotent)
INSERT INTO "Feature" ("id", "icon", "title", "text", "href", "sortOrder", "visible", "createdAt", "updatedAt")
SELECT * FROM (
  VALUES
    ('seed_feature_1', 'icon-risk', 'Financial Growth', 'Financial Revenue solution in business and enhancing.', '#', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_feature_2', 'icon-financial-presentation', 'Finance Planning', 'Supporting individuals in business challenges, and.', '#', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_feature_3', 'icon-approach', 'Business Advisory', 'Thanks for taking the time to make the website, but i.', '#', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v("id", "icon", "title", "text", "href", "sortOrder", "visible", "createdAt", "updatedAt")
WHERE NOT EXISTS (SELECT 1 FROM "Feature" LIMIT 1);
