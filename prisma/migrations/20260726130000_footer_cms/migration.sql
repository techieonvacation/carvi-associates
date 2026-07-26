-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "FooterLinkColumn" AS ENUM ('LINKS_ONE', 'LINKS_TWO', 'EXPLORE', 'BOTTOM');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "FooterSettings" (
    "id" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "backgroundImageUrl" TEXT NOT NULL,
    "watermarkText" TEXT NOT NULL DEFAULT 'CARVI ASSOCIATES',
    "showWatermark" BOOLEAN NOT NULL DEFAULT true,
    "copyrightText" TEXT NOT NULL DEFAULT 'by Carvi Associates.',
    "linksTitle" TEXT NOT NULL DEFAULT 'Links',
    "exploreTitle" TEXT NOT NULL DEFAULT 'Explore',
    "blogTitle" TEXT NOT NULL DEFAULT 'Recent Blog',
    "showAbout" BOOLEAN NOT NULL DEFAULT true,
    "showSocials" BOOLEAN NOT NULL DEFAULT true,
    "showLinks" BOOLEAN NOT NULL DEFAULT true,
    "showExplore" BOOLEAN NOT NULL DEFAULT true,
    "showRecentBlog" BOOLEAN NOT NULL DEFAULT true,
    "showBottomBar" BOOLEAN NOT NULL DEFAULT true,
    "useSiteSocials" BOOLEAN NOT NULL DEFAULT true,
    "logoTone" TEXT NOT NULL DEFAULT 'dark',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "canonicalUrl" TEXT,
    "ogImageUrl" TEXT,
    "twitterImageUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "FooterLink" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL DEFAULT '#',
    "column" "FooterLinkColumn" NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterLink_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "FooterLink_column_displayOrder_idx" ON "FooterLink"("column", "displayOrder");
CREATE INDEX IF NOT EXISTS "FooterLink_deletedAt_idx" ON "FooterLink"("deletedAt");

-- CreateTable
CREATE TABLE IF NOT EXISTS "FooterRecentPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dateLabel" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "href" TEXT NOT NULL DEFAULT '#',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterRecentPost_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "FooterRecentPost_displayOrder_idx" ON "FooterRecentPost"("displayOrder");
CREATE INDEX IF NOT EXISTS "FooterRecentPost_deletedAt_idx" ON "FooterRecentPost"("deletedAt");

-- CreateTable
CREATE TABLE IF NOT EXISTS "FooterSocialLink" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterSocialLink_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "FooterSocialLink_displayOrder_idx" ON "FooterSocialLink"("displayOrder");
CREATE INDEX IF NOT EXISTS "FooterSocialLink_deletedAt_idx" ON "FooterSocialLink"("deletedAt");

-- Seed FooterSettings
INSERT INTO "FooterSettings" (
  "id", "about", "backgroundImageUrl", "watermarkText", "showWatermark",
  "copyrightText", "linksTitle", "exploreTitle", "blogTitle",
  "showAbout", "showSocials", "showLinks", "showExplore", "showRecentBlog",
  "showBottomBar", "useSiteSocials", "logoTone", "isVisible", "noIndex", "updatedAt"
)
VALUES (
  'default',
  'Carvi Associates is a modern finance, business & consulting practice helping individuals and companies plan, invest, and grow with confidence.',
  '/images/backgrounds/footer-bg.jpg',
  'CARVI ASSOCIATES',
  true,
  'by Carvi Associates.',
  'Links',
  'Explore',
  'Recent Blog',
  true, true, true, true, true, true, true,
  'dark',
  true,
  false,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

-- Seed footer links when empty
INSERT INTO "FooterLink" ("id", "label", "href", "column", "displayOrder", "isVisible", "isActive", "createdAt", "updatedAt")
SELECT * FROM (
  VALUES
    ('seed_fl_1', 'About Us', '#', 'LINKS_ONE'::"FooterLinkColumn", 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_2', 'Contact', '#', 'LINKS_ONE'::"FooterLinkColumn", 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_3', 'Faqs', '#', 'LINKS_ONE'::"FooterLinkColumn", 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_4', 'Packages', '#', 'LINKS_ONE'::"FooterLinkColumn", 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_5', 'Maps', '#', 'LINKS_ONE'::"FooterLinkColumn", 4, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_6', 'Services', '#', 'LINKS_ONE'::"FooterLinkColumn", 5, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_7', 'Team', '#', 'LINKS_TWO'::"FooterLinkColumn", 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_8', 'Projects', '#', 'LINKS_TWO'::"FooterLinkColumn", 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_9', 'Video', '#', 'LINKS_TWO'::"FooterLinkColumn", 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_10', 'Gallery', '#', 'LINKS_TWO'::"FooterLinkColumn", 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_11', 'Brand', '#', 'LINKS_TWO'::"FooterLinkColumn", 4, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_12', 'Blog', '#', 'LINKS_TWO'::"FooterLinkColumn", 5, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_13', 'What We Offer', '#', 'EXPLORE'::"FooterLinkColumn", 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_14', 'Our Story', '#', 'EXPLORE'::"FooterLinkColumn", 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_15', 'Watch Video', '#', 'EXPLORE'::"FooterLinkColumn", 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_16', 'What We Do', '#', 'EXPLORE'::"FooterLinkColumn", 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_17', 'Latest News', '#', 'EXPLORE'::"FooterLinkColumn", 4, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_18', 'Help Center', '#', 'EXPLORE'::"FooterLinkColumn", 5, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_19', 'Privacy', '#', 'BOTTOM'::"FooterLinkColumn", 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_20', 'Policy', '#', 'BOTTOM'::"FooterLinkColumn", 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fl_21', 'Contact Us', '#', 'BOTTOM'::"FooterLinkColumn", 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v("id", "label", "href", "column", "displayOrder", "isVisible", "isActive", "createdAt", "updatedAt")
WHERE NOT EXISTS (SELECT 1 FROM "FooterLink" LIMIT 1);

-- Seed recent posts when empty
INSERT INTO "FooterRecentPost" (
  "id", "title", "dateLabel", "imageUrl", "imageAlt", "href",
  "displayOrder", "isVisible", "isActive", "createdAt", "updatedAt"
)
SELECT * FROM (
  VALUES
    (
      'seed_frp_1',
      'This Specific Issue Network Security',
      '10 May 2024',
      '/images/blog/footer-blog-1-1.jpg',
      'Network security blog',
      '#',
      0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
    (
      'seed_frp_2',
      'In up So Discovery my Middleton',
      '23 February 2025',
      '/images/blog/footer-blog-1-2.jpg',
      'Discovery blog',
      '#',
      1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
) AS v("id", "title", "dateLabel", "imageUrl", "imageAlt", "href", "displayOrder", "isVisible", "isActive", "createdAt", "updatedAt")
WHERE NOT EXISTS (SELECT 1 FROM "FooterRecentPost" LIMIT 1);

-- Seed footer socials (custom fallback) when empty
INSERT INTO "FooterSocialLink" (
  "id", "label", "href", "icon", "displayOrder", "isVisible", "isActive", "createdAt", "updatedAt"
)
SELECT * FROM (
  VALUES
    ('seed_fs_1', 'Facebook', 'https://facebook.com', 'fa-facebook-f', 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fs_2', 'X', 'https://x.com', 'fa-twitter', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fs_3', 'Linkedin', 'https://linkedin.com', 'fa-linkedin-in', 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_fs_4', 'Instagram', 'https://instagram.com', 'fa-instagram', 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v("id", "label", "href", "icon", "displayOrder", "isVisible", "isActive", "createdAt", "updatedAt")
WHERE NOT EXISTS (SELECT 1 FROM "FooterSocialLink" LIMIT 1);
