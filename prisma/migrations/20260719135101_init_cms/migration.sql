-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MANAGER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopbarSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressMapUrl" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneHref" TEXT NOT NULL,
    "whatsappLabel" TEXT NOT NULL,
    "whatsappHref" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopbarSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "tagline" TEXT NOT NULL,
    "titleBeforeVideo" TEXT NOT NULL,
    "titleHighlight" TEXT NOT NULL,
    "titleAfterVideo" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "ctaHref" TEXT NOT NULL,
    "videoId" TEXT,
    "heroImageUrl" TEXT NOT NULL,
    "activeUserCount" INTEGER NOT NULL DEFAULT 125,
    "activeUserSuffix" TEXT NOT NULL DEFAULT 'k+',
    "activeUserLabel" TEXT NOT NULL DEFAULT 'Active Users',
    "activeUserImages" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "contactCtaText" TEXT NOT NULL DEFAULT 'Contact Us',
    "contactCtaHref" TEXT NOT NULL DEFAULT '#',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeaderSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "NavItem_sortOrder_idx" ON "NavItem"("sortOrder");

-- CreateIndex
CREATE INDEX "SocialLink_sortOrder_idx" ON "SocialLink"("sortOrder");
