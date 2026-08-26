CREATE TABLE IF NOT EXISTS "ContactSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "tagline" TEXT NOT NULL DEFAULT 'Our Contact Now',
    "titleLine1" TEXT NOT NULL DEFAULT 'Request A Free Quote',
    "titleLine2" TEXT NOT NULL DEFAULT 'Get This Contact.',
    "taglineBg" TEXT NOT NULL DEFAULT '#ffffff',
    "phoneTitle" TEXT NOT NULL DEFAULT 'Get Contact Now',
    "emailTitle" TEXT NOT NULL DEFAULT 'Send Us Email',
    "locationTitle" TEXT NOT NULL DEFAULT 'Location Map',
    "submitLabel" TEXT NOT NULL DEFAULT 'SEND REQUEST',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "canonicalUrl" TEXT,
    "ogImageUrl" TEXT,
    "twitterImageUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "ContactSettings" ("id", "updatedAt") VALUES ('default', NOW())
ON CONFLICT ("id") DO NOTHING;
