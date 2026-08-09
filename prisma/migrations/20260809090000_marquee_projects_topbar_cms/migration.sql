-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "MarqueeBandTarget" AS ENUM ('ONE', 'TWO', 'BOTH');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "MarqueeItemKind" AS ENUM ('TEXT', 'IMAGE', 'TEXT_IMAGE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "TopbarSettings"
  ADD COLUMN IF NOT EXISTS "whatsappMarqueeText" TEXT NOT NULL DEFAULT 'Join our WhatsApp Channel for daily tax, GST & compliance updates',
  ADD COLUMN IF NOT EXISTS "whatsappMarqueeSpeed" INTEGER NOT NULL DEFAULT 22,
  ADD COLUMN IF NOT EXISTS "showWhatsappMarquee" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "WhyChooseSettings"
  ADD COLUMN IF NOT EXISTS "imageFit" TEXT NOT NULL DEFAULT 'cover',
  ADD COLUMN IF NOT EXISTS "imageMinHeightPx" INTEGER NOT NULL DEFAULT 560,
  ADD COLUMN IF NOT EXISTS "showImageShape" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE IF NOT EXISTS "MarqueeSettings" (
    "id" TEXT NOT NULL,
    "ariaLabel" TEXT NOT NULL DEFAULT 'Practice highlights',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "showBandOne" BOOLEAN NOT NULL DEFAULT true,
    "showBandTwo" BOOLEAN NOT NULL DEFAULT true,
    "bandOneBgColor" TEXT NOT NULL DEFAULT '#5c6b45',
    "bandOneTextColor" TEXT NOT NULL DEFAULT '#fffdf8',
    "bandTwoBgColor" TEXT NOT NULL DEFAULT '#e3c9a0',
    "bandTwoTextColor" TEXT NOT NULL DEFAULT '#5c6b45',
    "bandOneDirection" TEXT NOT NULL DEFAULT 'left',
    "bandTwoDirection" TEXT NOT NULL DEFAULT 'right',
    "bandOneSpeedSeconds" INTEGER NOT NULL DEFAULT 34,
    "bandTwoSpeedSeconds" INTEGER NOT NULL DEFAULT 34,
    "bandOneSeparatorUrl" TEXT NOT NULL DEFAULT '/images/shapes/slidet-text-shape-1.png',
    "bandTwoSeparatorUrl" TEXT NOT NULL DEFAULT '/images/shapes/slidet-text-shape-2.png',
    "showSeparator" BOOLEAN NOT NULL DEFAULT true,
    "skewDegrees" DOUBLE PRECISION NOT NULL DEFAULT 7.412,
    "fontSizePx" INTEGER NOT NULL DEFAULT 35,
    "itemGapPx" INTEGER NOT NULL DEFAULT 30,
    "bandPaddingPx" INTEGER NOT NULL DEFAULT 32,
    "alternateOutline" BOOLEAN NOT NULL DEFAULT true,
    "pauseOnHover" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarqueeSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "MarqueeItem" (
    "id" TEXT NOT NULL,
    "kind" "MarqueeItemKind" NOT NULL DEFAULT 'TEXT',
    "band" "MarqueeBandTarget" NOT NULL DEFAULT 'BOTH',
    "text" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "imageWidth" INTEGER NOT NULL DEFAULT 120,
    "imageHeight" INTEGER NOT NULL DEFAULT 40,
    "href" TEXT,
    "outlined" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarqueeItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "MarqueeItem_displayOrder_idx" ON "MarqueeItem"("displayOrder");
CREATE INDEX IF NOT EXISTS "MarqueeItem_deletedAt_idx" ON "MarqueeItem"("deletedAt");
CREATE INDEX IF NOT EXISTS "MarqueeItem_isVisible_isActive_deletedAt_idx" ON "MarqueeItem"("isVisible", "isActive", "deletedAt");

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProjectsSectionSettings" (
    "id" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "titleLine1" TEXT NOT NULL,
    "titleLine2" TEXT NOT NULL,
    "taglineBg" TEXT NOT NULL DEFAULT '#fffdf8',
    "topBackgroundImageUrl" TEXT NOT NULL DEFAULT '/images/shapes/projects-bg-shape-1-1.png',
    "bottomBackgroundImageUrl" TEXT NOT NULL DEFAULT '/images/shapes/projects-bg-shape-1-2.png',
    "showFilters" BOOLEAN NOT NULL DEFAULT true,
    "allFilterLabel" TEXT NOT NULL DEFAULT 'All',
    "showBottomBanner" BOOLEAN NOT NULL DEFAULT true,
    "bannerStat" TEXT NOT NULL DEFAULT '25,860+',
    "bannerTitleLine1" TEXT NOT NULL,
    "bannerTitleLine2" TEXT NOT NULL,
    "bannerChecklist" JSONB NOT NULL DEFAULT '[]',
    "bannerButtonText" TEXT NOT NULL DEFAULT 'View All Projects',
    "bannerButtonHref" TEXT NOT NULL DEFAULT '#',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "canonicalUrl" TEXT,
    "ogImageUrl" TEXT,
    "twitterImageUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectsSectionSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProjectCategory" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ProjectCategory_slug_key" ON "ProjectCategory"("slug");
CREATE INDEX IF NOT EXISTS "ProjectCategory_displayOrder_idx" ON "ProjectCategory"("displayOrder");
CREATE INDEX IF NOT EXISTS "ProjectCategory_deletedAt_idx" ON "ProjectCategory"("deletedAt");

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProjectItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'icon-business-and-finance',
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "href" TEXT NOT NULL DEFAULT '#',
    "slug" TEXT,
    "categorySlug" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ProjectItem_slug_key" ON "ProjectItem"("slug");
CREATE INDEX IF NOT EXISTS "ProjectItem_displayOrder_idx" ON "ProjectItem"("displayOrder");
CREATE INDEX IF NOT EXISTS "ProjectItem_deletedAt_idx" ON "ProjectItem"("deletedAt");
CREATE INDEX IF NOT EXISTS "ProjectItem_categorySlug_idx" ON "ProjectItem"("categorySlug");
CREATE INDEX IF NOT EXISTS "ProjectItem_isVisible_isActive_deletedAt_idx" ON "ProjectItem"("isVisible", "isActive", "deletedAt");
