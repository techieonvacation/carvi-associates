-- CreateTable
CREATE TABLE IF NOT EXISTS "TeamSettings" (
    "id" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "titleLine1" TEXT NOT NULL,
    "titleLine2" TEXT NOT NULL,
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

    CONSTRAINT "TeamSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "href" TEXT NOT NULL DEFAULT '#',
    "socials" JSONB NOT NULL DEFAULT '[]',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "TeamMember_displayOrder_idx" ON "TeamMember"("displayOrder");
CREATE INDEX IF NOT EXISTS "TeamMember_deletedAt_idx" ON "TeamMember"("deletedAt");
CREATE INDEX IF NOT EXISTS "TeamMember_isVisible_isActive_deletedAt_idx" ON "TeamMember"("isVisible", "isActive", "deletedAt");

-- CreateTable
CREATE TABLE IF NOT EXISTS "WorkingProcessSettings" (
    "id" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "titleLine1" TEXT NOT NULL,
    "titleLine2" TEXT NOT NULL,
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

    CONSTRAINT "WorkingProcessSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WorkingProcessStep" (
    "id" TEXT NOT NULL,
    "stepLabel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "href" TEXT NOT NULL DEFAULT '#',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkingProcessStep_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "WorkingProcessStep_displayOrder_idx" ON "WorkingProcessStep"("displayOrder");
CREATE INDEX IF NOT EXISTS "WorkingProcessStep_deletedAt_idx" ON "WorkingProcessStep"("deletedAt");
CREATE INDEX IF NOT EXISTS "WorkingProcessStep_isVisible_isActive_deletedAt_idx" ON "WorkingProcessStep"("isVisible", "isActive", "deletedAt");

-- Seed Team settings
INSERT INTO "TeamSettings" (
  "id", "tagline", "titleLine1", "titleLine2", "taglineBg", "isVisible", "noIndex", "updatedAt"
)
VALUES (
  'default',
  'OUR Team member',
  'Our Financial Experts The Team',
  'Member Solution.',
  '#f4ebd8',
  true,
  false,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

-- Seed Team members when empty
INSERT INTO "TeamMember" (
  "id", "name", "role", "imageUrl", "imageAlt", "href", "socials",
  "displayOrder", "isVisible", "isActive", "createdAt", "updatedAt"
)
SELECT * FROM (
  VALUES
    ('seed_team_1', 'Christine Rose', 'Founder', '/images/team/team-1-1.png', 'Christine Rose', '#', '[]'::jsonb, 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_team_2', 'Thomas Adison', 'Co - Founder', '/images/team/team-1-2.png', 'Thomas Adison', '#', '[]'::jsonb, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_team_3', 'Jhone Doe', 'Manager', '/images/team/team-1-3.png', 'Jhone Doe', '#', '[]'::jsonb, 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_team_4', 'Sharon Ratley', 'Marketer', '/images/team/team-1-4.png', 'Sharon Ratley', '#', '[]'::jsonb, 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_team_5', 'Adlof Carr', 'Business Consultant', '/images/team/team-1-5.png', 'Adlof Carr', '#', '[]'::jsonb, 4, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_team_6', 'Isabella Leo', 'Support Engineer', '/images/team/team-1-6.png', 'Isabella Leo', '#', '[]'::jsonb, 5, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_team_7', 'Judith White', 'Creative Director', '/images/team/team-1-7.png', 'Judith White', '#', '[]'::jsonb, 6, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_team_8', 'Paul Dotson', 'Partnership Lead', '/images/team/team-1-8.png', 'Paul Dotson', '#', '[]'::jsonb, 7, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v("id", "name", "role", "imageUrl", "imageAlt", "href", "socials", "displayOrder", "isVisible", "isActive", "createdAt", "updatedAt")
WHERE NOT EXISTS (SELECT 1 FROM "TeamMember" LIMIT 1);

-- Seed Working Process settings
INSERT INTO "WorkingProcessSettings" (
  "id", "tagline", "titleLine1", "titleLine2", "taglineBg", "isVisible", "noIndex", "updatedAt"
)
VALUES (
  'default',
  'Our Working Process',
  'Over The Solution Work Financial',
  'Of Provided Company.',
  '#f4ebd8',
  true,
  false,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

-- Seed Working Process steps when empty
INSERT INTO "WorkingProcessStep" (
  "id", "stepLabel", "title", "text", "imageUrl", "imageAlt", "href",
  "displayOrder", "isVisible", "isActive", "createdAt", "updatedAt"
)
SELECT * FROM (
  VALUES
    (
      'seed_wp_1',
      'Step 01',
      'Market Analysis',
      'Financial work provided best investments capital.',
      '/images/resources/working-process-1-1.jpg',
      'Market Analysis',
      '#',
      0,
      true,
      true,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ),
    (
      'seed_wp_2',
      'Step 02',
      'Finance Planning',
      'We are teiduals in business challenges, of enhancing.',
      '/images/resources/working-process-1-2.jpg',
      'Finance Planning',
      '#',
      1,
      true,
      true,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ),
    (
      'seed_wp_3',
      'Step 03',
      'Investment Appraisal',
      'It is pleasure, but because those who do not know.',
      '/images/resources/working-process-1-3.jpg',
      'Investment Appraisal',
      '#',
      2,
      true,
      true,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ),
    (
      'seed_wp_4',
      'Step 04',
      'Completed Work',
      'Continually myocardinate holistic mindshare with.',
      '/images/resources/working-process-1-4.jpg',
      'Completed Work',
      '#',
      3,
      true,
      true,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
) AS v("id", "stepLabel", "title", "text", "imageUrl", "imageAlt", "href", "displayOrder", "isVisible", "isActive", "createdAt", "updatedAt")
WHERE NOT EXISTS (SELECT 1 FROM "WorkingProcessStep" LIMIT 1);
