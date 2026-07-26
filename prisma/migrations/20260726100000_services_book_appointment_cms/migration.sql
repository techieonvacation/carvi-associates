-- CreateTable
CREATE TABLE IF NOT EXISTS "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "alt" TEXT NOT NULL DEFAULT '',
    "caption" TEXT NOT NULL DEFAULT '',
    "credit" TEXT NOT NULL DEFAULT '',
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" TEXT,
    "blurDataUrl" TEXT,
    "folder" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Media_deletedAt_idx" ON "Media"("deletedAt");
CREATE INDEX IF NOT EXISTS "Media_createdAt_idx" ON "Media"("createdAt");

-- CreateTable
CREATE TABLE IF NOT EXISTS "ServicesSectionSettings" (
    "id" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "titleLine1" TEXT NOT NULL,
    "titleLine2" TEXT NOT NULL,
    "cardTagline" TEXT NOT NULL,
    "taglineBg" TEXT NOT NULL DEFAULT '#fffdf8',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "canonicalUrl" TEXT,
    "ogImageUrl" TEXT,
    "twitterImageUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicesSectionSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Service" (
    "id" TEXT NOT NULL,
    "titleLine1" TEXT NOT NULL,
    "titleLine2" TEXT NOT NULL,
    "shortTitle" TEXT,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "slug" TEXT,
    "icon" TEXT NOT NULL,
    "iconType" TEXT NOT NULL DEFAULT 'icomoon',
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "hoverImageUrl" TEXT,
    "badge" TEXT,
    "category" TEXT,
    "serviceType" TEXT,
    "accentColor" TEXT,
    "ctaText" TEXT NOT NULL DEFAULT 'Learn more',
    "ctaHref" TEXT NOT NULL DEFAULT '#',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "canonicalUrl" TEXT,
    "ogImageUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Service_slug_key" ON "Service"("slug");
CREATE INDEX IF NOT EXISTS "Service_displayOrder_idx" ON "Service"("displayOrder");
CREATE INDEX IF NOT EXISTS "Service_deletedAt_idx" ON "Service"("deletedAt");
CREATE INDEX IF NOT EXISTS "Service_isVisible_isActive_deletedAt_idx" ON "Service"("isVisible", "isActive", "deletedAt");

-- CreateTable
CREATE TABLE IF NOT EXISTS "BookAppointmentSettings" (
    "id" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "titleLine1" TEXT NOT NULL,
    "titleLine2" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "primaryButtonText" TEXT NOT NULL DEFAULT 'Get Started',
    "primaryButtonHref" TEXT NOT NULL DEFAULT '#',
    "secondaryButtonText" TEXT NOT NULL DEFAULT 'Contact Now',
    "secondaryButtonHref" TEXT NOT NULL DEFAULT '#',
    "backgroundImageUrl" TEXT NOT NULL,
    "backgroundImageAlt" TEXT NOT NULL DEFAULT '',
    "taglineBg" TEXT NOT NULL DEFAULT '#f4ebd8',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "canonicalUrl" TEXT,
    "ogImageUrl" TEXT,
    "twitterImageUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookAppointmentSettings_pkey" PRIMARY KEY ("id")
);

-- Seed Services section settings (idempotent)
INSERT INTO "ServicesSectionSettings" (
  "id", "tagline", "titleLine1", "titleLine2", "cardTagline", "taglineBg",
  "isVisible", "noIndex", "updatedAt"
)
VALUES (
  'default',
  'Our Best Services',
  'Expert Advice For Consulting',
  'Finance Services.',
  'Finance Strategic Business',
  '#fffdf8',
  true,
  false,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

-- Seed Book Appointment settings (idempotent)
INSERT INTO "BookAppointmentSettings" (
  "id", "tagline", "titleLine1", "titleLine2", "description",
  "primaryButtonText", "primaryButtonHref", "secondaryButtonText", "secondaryButtonHref",
  "backgroundImageUrl", "backgroundImageAlt", "taglineBg", "isVisible", "noIndex", "updatedAt"
)
VALUES (
  'default',
  'Book Appointment Now',
  'Get Any Kind Of Finance Service',
  'Free To Contact Us.',
  'Financial services provided company that help individuals get this now or other contacts manage money make investments capital.',
  'Get Started',
  '#',
  'Contact Now',
  '#',
  '/images/backgrounds/book-appointment-bg.jpg',
  'Book an appointment with Carvi Associates',
  '#f4ebd8',
  true,
  false,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

-- Seed default services when table is empty (idempotent)
INSERT INTO "Service" (
  "id", "titleLine1", "titleLine2", "description", "slug", "icon", "iconType",
  "imageUrl", "imageAlt", "ctaText", "ctaHref", "displayOrder",
  "isFeatured", "isPopular", "isActive", "isVisible", "publishedAt",
  "noIndex", "createdAt", "updatedAt"
)
SELECT * FROM (
  VALUES
    (
      'seed_service_1',
      'Business Analytics',
      'Statistics',
      'Delivering clear insight from complex financial data sets.',
      'business-analytics-statistics',
      'icon-stats-2',
      'icomoon',
      '/images/services/service-1-1.jpg',
      'Business analytics and statistics advisory',
      'Learn more',
      '#',
      0,
      true,
      false,
      true,
      true,
      CURRENT_TIMESTAMP,
      false,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ),
    (
      'seed_service_2',
      'Personal Finance',
      'Services',
      'Guiding individuals toward smarter long-term money decisions.',
      'personal-finance-services',
      'icon-agreement',
      'icomoon',
      '/images/services/service-1-2.jpg',
      'Personal finance services',
      'Learn more',
      '#',
      1,
      false,
      true,
      true,
      true,
      CURRENT_TIMESTAMP,
      false,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ),
    (
      'seed_service_3',
      'Banking & Business',
      'Accounts',
      'Streamlined account structures built for growing businesses.',
      'banking-business-accounts',
      'icon-bank',
      'icomoon',
      '/images/services/service-1-3.jpg',
      'Banking and business accounts',
      'Learn more',
      '#',
      2,
      false,
      false,
      true,
      true,
      CURRENT_TIMESTAMP,
      false,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ),
    (
      'seed_service_4',
      'Financial Data Analysis',
      'Solutions',
      'Turning raw numbers into confident, actionable strategy.',
      'financial-data-analysis-solutions',
      'icon-analysis',
      'icomoon',
      '/images/services/service-1-4.jpg',
      'Financial data analysis solutions',
      'Learn more',
      '#',
      3,
      false,
      false,
      true,
      true,
      CURRENT_TIMESTAMP,
      false,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ),
    (
      'seed_service_5',
      'Strategic Finance',
      'Planning',
      'Roadmaps that align today''s budget with tomorrow''s goals.',
      'strategic-finance-planning',
      'icon-planning',
      'icomoon',
      '/images/services/service-1-5.jpg',
      'Strategic finance planning',
      'Learn more',
      '#',
      4,
      false,
      false,
      true,
      true,
      CURRENT_TIMESTAMP,
      false,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ),
    (
      'seed_service_6',
      '24/7 Team Support',
      'Services',
      'Always-on advisory support whenever a question comes up.',
      'team-support-services',
      'icon-support',
      'icomoon',
      '/images/services/service-1-6.jpg',
      '24/7 team support services',
      'Learn more',
      '#',
      5,
      false,
      false,
      true,
      true,
      CURRENT_TIMESTAMP,
      false,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
) AS v(
  "id", "titleLine1", "titleLine2", "description", "slug", "icon", "iconType",
  "imageUrl", "imageAlt", "ctaText", "ctaHref", "displayOrder",
  "isFeatured", "isPopular", "isActive", "isVisible", "publishedAt",
  "noIndex", "createdAt", "updatedAt"
)
WHERE NOT EXISTS (SELECT 1 FROM "Service" LIMIT 1);
