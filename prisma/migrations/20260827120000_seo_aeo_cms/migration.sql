DO $$ BEGIN
  CREATE TYPE "SeoOrganizationType" AS ENUM ('ORGANIZATION', 'LOCAL_BUSINESS', 'PROFESSIONAL_SERVICE', 'ACCOUNTING_SERVICE', 'FINANCIAL_SERVICE', 'LEGAL_SERVICE', 'CORPORATION', 'CONSULTING_AGENCY');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SeoTwitterCard" AS ENUM ('SUMMARY', 'SUMMARY_LARGE_IMAGE', 'APP', 'PLAYER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SeoChangeFrequency" AS ENUM ('ALWAYS', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'NEVER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SeoImagePreview" AS ENUM ('NONE', 'STANDARD', 'LARGE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SeoScriptPlacement" AS ENUM ('HEAD', 'BODY_START', 'BODY_END');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SeoScriptStrategy" AS ENUM ('BEFORE_INTERACTIVE', 'AFTER_INTERACTIVE', 'LAZY_ONLOAD', 'WORKER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SeoScriptScope" AS ENUM ('ALL', 'INCLUDE', 'EXCLUDE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SeoConsentCategory" AS ENUM ('NECESSARY', 'ANALYTICS', 'MARKETING', 'PREFERENCES');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SeoIntegrationProvider" AS ENUM ('GOOGLE_ANALYTICS', 'GOOGLE_TAG_MANAGER', 'GOOGLE_ADS', 'GOOGLE_SEARCH_CONSOLE', 'GOOGLE_OPTIMIZE', 'BING_WEBMASTER', 'BING_UET', 'META_PIXEL', 'LINKEDIN_INSIGHT', 'TIKTOK_PIXEL', 'PINTEREST_TAG', 'X_PIXEL', 'HOTJAR', 'MICROSOFT_CLARITY', 'PLAUSIBLE', 'FATHOM', 'MATOMO', 'POSTHOG', 'YANDEX_METRICA', 'CRISP_CHAT', 'TAWK_TO', 'INTERCOM', 'CUSTOM');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SeoScopeKind" AS ENUM ('GLOBAL', 'PAGE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SeoRedirectMatch" AS ENUM ('EXACT', 'PREFIX', 'REGEX');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "SeoSettings" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "siteName" TEXT NOT NULL DEFAULT 'Carvi Associates',
  "siteShortName" TEXT NOT NULL DEFAULT 'Carvi',
  "siteUrl" TEXT NOT NULL DEFAULT 'https://www.carviassociates.com',
  "defaultTitle" TEXT NOT NULL DEFAULT 'Carvi Associates | Chartered Accountants',
  "titleTemplate" TEXT NOT NULL DEFAULT '%s | Carvi Associates',
  "applyTitleTemplate" BOOLEAN NOT NULL DEFAULT true,
  "defaultDescription" TEXT NOT NULL DEFAULT 'Carvi Associates — Chartered Accountants offering audit, tax, GST, compliance and advisory services for Indian businesses.',
  "defaultKeywords" TEXT NOT NULL DEFAULT 'chartered accountants, audit, income tax, GST, ROC compliance, business advisory, India',
  "siteLanguage" TEXT NOT NULL DEFAULT 'en',
  "siteLocale" TEXT NOT NULL DEFAULT 'en_IN',
  "alternateLocales" JSONB NOT NULL DEFAULT '[]',
  "applicationName" TEXT NOT NULL DEFAULT 'Carvi Associates',
  "publisherName" TEXT NOT NULL DEFAULT 'Carvi Associates',
  "authorName" TEXT NOT NULL DEFAULT 'Carvi Associates',
  "generatorName" TEXT NOT NULL DEFAULT '',
  "copyrightText" TEXT NOT NULL DEFAULT '',
  "categoryMeta" TEXT NOT NULL DEFAULT 'Finance',
  "referrerPolicy" TEXT NOT NULL DEFAULT 'origin-when-cross-origin',
  "colorScheme" TEXT NOT NULL DEFAULT 'light',
  "formatDetectionTelephone" BOOLEAN NOT NULL DEFAULT false,
  "faviconUrl" TEXT NOT NULL DEFAULT '/images/favicons/favicon-32x32.png',
  "faviconSmallUrl" TEXT NOT NULL DEFAULT '/images/favicons/favicon-16x16.png',
  "appleTouchIconUrl" TEXT NOT NULL DEFAULT '/images/favicons/apple-touch-icon.png',
  "svgIconUrl" TEXT NOT NULL DEFAULT '',
  "maskIconUrl" TEXT NOT NULL DEFAULT '',
  "maskIconColor" TEXT NOT NULL DEFAULT '#006654',
  "themeColorLight" TEXT NOT NULL DEFAULT '#ffffff',
  "themeColorDark" TEXT NOT NULL DEFAULT '#0b1f1b',
  "indexingEnabled" BOOLEAN NOT NULL DEFAULT true,
  "defaultNoIndex" BOOLEAN NOT NULL DEFAULT false,
  "defaultNoFollow" BOOLEAN NOT NULL DEFAULT false,
  "defaultNoArchive" BOOLEAN NOT NULL DEFAULT false,
  "defaultNoSnippet" BOOLEAN NOT NULL DEFAULT false,
  "defaultNoImageIndex" BOOLEAN NOT NULL DEFAULT false,
  "maxSnippet" INTEGER NOT NULL DEFAULT -1,
  "maxImagePreview" "SeoImagePreview" NOT NULL DEFAULT 'LARGE',
  "maxVideoPreview" INTEGER NOT NULL DEFAULT -1,
  "robotsEnabled" BOOLEAN NOT NULL DEFAULT true,
  "robotsUseCustom" BOOLEAN NOT NULL DEFAULT false,
  "robotsCustomContent" TEXT NOT NULL DEFAULT '',
  "robotsExtraLines" TEXT NOT NULL DEFAULT '',
  "robotsHost" TEXT NOT NULL DEFAULT '',
  "robotsCrawlDelay" INTEGER,
  "blockAiCrawlers" BOOLEAN NOT NULL DEFAULT false,
  "allowedAiCrawlers" JSONB NOT NULL DEFAULT '[]',
  "sitemapEnabled" BOOLEAN NOT NULL DEFAULT true,
  "sitemapIncludeImages" BOOLEAN NOT NULL DEFAULT true,
  "sitemapIncludeBlog" BOOLEAN NOT NULL DEFAULT true,
  "sitemapIncludeServices" BOOLEAN NOT NULL DEFAULT true,
  "sitemapIncludeCategories" BOOLEAN NOT NULL DEFAULT true,
  "sitemapIncludeTags" BOOLEAN NOT NULL DEFAULT false,
  "sitemapIncludeAuthors" BOOLEAN NOT NULL DEFAULT true,
  "sitemapIncludePages" BOOLEAN NOT NULL DEFAULT true,
  "sitemapDefaultChangeFreq" "SeoChangeFrequency" NOT NULL DEFAULT 'WEEKLY',
  "sitemapHomePriority" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "sitemapPagePriority" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
  "sitemapBlogPriority" DOUBLE PRECISION NOT NULL DEFAULT 0.9,
  "sitemapPostPriority" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
  "sitemapServicePriority" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
  "sitemapMaxUrls" INTEGER NOT NULL DEFAULT 5000,
  "ogType" TEXT NOT NULL DEFAULT 'website',
  "ogSiteName" TEXT NOT NULL DEFAULT 'Carvi Associates',
  "ogImageUrl" TEXT NOT NULL DEFAULT '',
  "ogImageAlt" TEXT NOT NULL DEFAULT '',
  "ogImageWidth" INTEGER NOT NULL DEFAULT 1200,
  "ogImageHeight" INTEGER NOT NULL DEFAULT 630,
  "twitterCard" "SeoTwitterCard" NOT NULL DEFAULT 'SUMMARY_LARGE_IMAGE',
  "twitterSite" TEXT NOT NULL DEFAULT '',
  "twitterCreator" TEXT NOT NULL DEFAULT '',
  "twitterImageUrl" TEXT NOT NULL DEFAULT '',
  "facebookAppId" TEXT NOT NULL DEFAULT '',
  "facebookPageUrl" TEXT NOT NULL DEFAULT '',
  "googleSiteVerification" TEXT NOT NULL DEFAULT '',
  "bingSiteVerification" TEXT NOT NULL DEFAULT '',
  "yandexVerification" TEXT NOT NULL DEFAULT '',
  "yahooVerification" TEXT NOT NULL DEFAULT '',
  "pinterestVerification" TEXT NOT NULL DEFAULT '',
  "facebookDomainVerification" TEXT NOT NULL DEFAULT '',
  "baiduVerification" TEXT NOT NULL DEFAULT '',
  "nortonVerification" TEXT NOT NULL DEFAULT '',
  "customVerifications" JSONB NOT NULL DEFAULT '[]',
  "organizationEnabled" BOOLEAN NOT NULL DEFAULT true,
  "organizationType" "SeoOrganizationType" NOT NULL DEFAULT 'ACCOUNTING_SERVICE',
  "organizationName" TEXT NOT NULL DEFAULT 'Carvi Associates',
  "organizationLegalName" TEXT NOT NULL DEFAULT 'Carvi & Associates',
  "organizationAlternateName" TEXT NOT NULL DEFAULT '',
  "organizationDescription" TEXT NOT NULL DEFAULT '',
  "organizationLogoUrl" TEXT NOT NULL DEFAULT '',
  "organizationImageUrl" TEXT NOT NULL DEFAULT '',
  "foundingDate" TEXT NOT NULL DEFAULT '',
  "founderName" TEXT NOT NULL DEFAULT '',
  "contactEmail" TEXT NOT NULL DEFAULT '',
  "contactPhone" TEXT NOT NULL DEFAULT '',
  "faxNumber" TEXT NOT NULL DEFAULT '',
  "priceRange" TEXT NOT NULL DEFAULT '$$',
  "currenciesAccepted" TEXT NOT NULL DEFAULT 'INR',
  "paymentAccepted" TEXT NOT NULL DEFAULT 'Cash, UPI, Bank Transfer',
  "streetAddress" TEXT NOT NULL DEFAULT '',
  "addressLocality" TEXT NOT NULL DEFAULT '',
  "addressRegion" TEXT NOT NULL DEFAULT '',
  "postalCode" TEXT NOT NULL DEFAULT '',
  "addressCountry" TEXT NOT NULL DEFAULT 'IN',
  "latitude" TEXT NOT NULL DEFAULT '',
  "longitude" TEXT NOT NULL DEFAULT '',
  "hasMapUrl" TEXT NOT NULL DEFAULT '',
  "areaServed" JSONB NOT NULL DEFAULT '[]',
  "openingHours" JSONB NOT NULL DEFAULT '[]',
  "sameAs" JSONB NOT NULL DEFAULT '[]',
  "contactPoints" JSONB NOT NULL DEFAULT '[]',
  "knowsAbout" JSONB NOT NULL DEFAULT '[]',
  "awards" JSONB NOT NULL DEFAULT '[]',
  "slogan" TEXT NOT NULL DEFAULT '',
  "numberOfEmployees" INTEGER,
  "taxId" TEXT NOT NULL DEFAULT '',
  "vatId" TEXT NOT NULL DEFAULT '',
  "registrationNumber" TEXT NOT NULL DEFAULT '',
  "aggregateRatingEnabled" BOOLEAN NOT NULL DEFAULT false,
  "ratingValue" DOUBLE PRECISION NOT NULL DEFAULT 5,
  "reviewCount" INTEGER NOT NULL DEFAULT 0,
  "websiteSchemaEnabled" BOOLEAN NOT NULL DEFAULT true,
  "searchboxEnabled" BOOLEAN NOT NULL DEFAULT false,
  "searchUrlTemplate" TEXT NOT NULL DEFAULT '/blog?q={search_term_string}',
  "breadcrumbsEnabled" BOOLEAN NOT NULL DEFAULT true,
  "webPageSchemaEnabled" BOOLEAN NOT NULL DEFAULT true,
  "aeoEnabled" BOOLEAN NOT NULL DEFAULT true,
  "speakableEnabled" BOOLEAN NOT NULL DEFAULT true,
  "speakableSelectors" JSONB NOT NULL DEFAULT '[]',
  "faqSchemaEnabled" BOOLEAN NOT NULL DEFAULT true,
  "qaPageEnabled" BOOLEAN NOT NULL DEFAULT false,
  "llmsTxtEnabled" BOOLEAN NOT NULL DEFAULT true,
  "llmsTxtAutoGenerate" BOOLEAN NOT NULL DEFAULT true,
  "llmsTxtContent" TEXT NOT NULL DEFAULT '',
  "aiSummary" TEXT NOT NULL DEFAULT '',
  "entityDefinition" TEXT NOT NULL DEFAULT '',
  "aiAnswerTargets" JSONB NOT NULL DEFAULT '[]',
  "rssEnabled" BOOLEAN NOT NULL DEFAULT true,
  "rssTitle" TEXT NOT NULL DEFAULT 'Carvi Associates — Knowledge Desk',
  "rssDescription" TEXT NOT NULL DEFAULT '',
  "rssItemLimit" INTEGER NOT NULL DEFAULT 20,
  "manifestEnabled" BOOLEAN NOT NULL DEFAULT true,
  "manifestName" TEXT NOT NULL DEFAULT 'Carvi Associates',
  "manifestShortName" TEXT NOT NULL DEFAULT 'Carvi',
  "manifestDescription" TEXT NOT NULL DEFAULT '',
  "manifestDisplay" TEXT NOT NULL DEFAULT 'standalone',
  "manifestStartUrl" TEXT NOT NULL DEFAULT '/',
  "manifestBackgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
  "manifestIcons" JSONB NOT NULL DEFAULT '[]',
  "preconnectUrls" JSONB NOT NULL DEFAULT '[]',
  "dnsPrefetchUrls" JSONB NOT NULL DEFAULT '[]',
  "hreflangEnabled" BOOLEAN NOT NULL DEFAULT false,
  "hreflangEntries" JSONB NOT NULL DEFAULT '[]',
  "canonicalHost" TEXT NOT NULL DEFAULT '',
  "forceTrailingSlash" BOOLEAN NOT NULL DEFAULT false,
  "redirectsEnabled" BOOLEAN NOT NULL DEFAULT true,
  "indexNowEnabled" BOOLEAN NOT NULL DEFAULT false,
  "indexNowKey" TEXT NOT NULL DEFAULT '',
  "customHeadHtml" TEXT NOT NULL DEFAULT '',
  "customBodyStartHtml" TEXT NOT NULL DEFAULT '',
  "customBodyEndHtml" TEXT NOT NULL DEFAULT '',
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeoSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SeoPage" (
  "id" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "label" TEXT NOT NULL DEFAULT '',
  "title" TEXT,
  "description" TEXT,
  "keywords" TEXT,
  "canonicalUrl" TEXT,
  "ogTitle" TEXT,
  "ogDescription" TEXT,
  "ogImageUrl" TEXT,
  "ogImageAlt" TEXT,
  "ogType" TEXT,
  "twitterTitle" TEXT,
  "twitterDescription" TEXT,
  "twitterImageUrl" TEXT,
  "twitterCard" "SeoTwitterCard",
  "noIndex" BOOLEAN NOT NULL DEFAULT false,
  "noFollow" BOOLEAN NOT NULL DEFAULT false,
  "noArchive" BOOLEAN NOT NULL DEFAULT false,
  "noSnippet" BOOLEAN NOT NULL DEFAULT false,
  "noImageIndex" BOOLEAN NOT NULL DEFAULT false,
  "maxSnippet" INTEGER,
  "maxImagePreview" "SeoImagePreview",
  "maxVideoPreview" INTEGER,
  "breadcrumbLabel" TEXT,
  "focusKeyword" TEXT NOT NULL DEFAULT '',
  "secondaryKeywords" TEXT NOT NULL DEFAULT '',
  "aiSummary" TEXT NOT NULL DEFAULT '',
  "speakableSelectors" JSONB NOT NULL DEFAULT '[]',
  "hreflangEntries" JSONB NOT NULL DEFAULT '[]',
  "customJsonLd" JSONB,
  "includeInSitemap" BOOLEAN NOT NULL DEFAULT true,
  "sitemapPriority" DOUBLE PRECISION,
  "sitemapChangeFreq" "SeoChangeFrequency",
  "sitemapLastMod" TIMESTAMP(3),
  "notes" TEXT NOT NULL DEFAULT '',
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeoPage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SeoPage_path_key" ON "SeoPage"("path");
CREATE INDEX IF NOT EXISTS "SeoPage_displayOrder_idx" ON "SeoPage"("displayOrder");
CREATE INDEX IF NOT EXISTS "SeoPage_deletedAt_idx" ON "SeoPage"("deletedAt");
CREATE INDEX IF NOT EXISTS "SeoPage_isActive_deletedAt_idx" ON "SeoPage"("isActive", "deletedAt");

CREATE TABLE IF NOT EXISTS "SeoRedirect" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "statusCode" INTEGER NOT NULL DEFAULT 308,
  "matchType" "SeoRedirectMatch" NOT NULL DEFAULT 'EXACT',
  "preserveQuery" BOOLEAN NOT NULL DEFAULT true,
  "hitCount" INTEGER NOT NULL DEFAULT 0,
  "lastHitAt" TIMESTAMP(3),
  "notes" TEXT NOT NULL DEFAULT '',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeoRedirect_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SeoRedirect_source_key" ON "SeoRedirect"("source");
CREATE INDEX IF NOT EXISTS "SeoRedirect_isActive_deletedAt_idx" ON "SeoRedirect"("isActive", "deletedAt");
CREATE INDEX IF NOT EXISTS "SeoRedirect_displayOrder_idx" ON "SeoRedirect"("displayOrder");

CREATE TABLE IF NOT EXISTS "SeoScript" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "placement" "SeoScriptPlacement" NOT NULL DEFAULT 'HEAD',
  "strategy" "SeoScriptStrategy" NOT NULL DEFAULT 'AFTER_INTERACTIVE',
  "scriptSrc" TEXT NOT NULL DEFAULT '',
  "inlineCode" TEXT NOT NULL DEFAULT '',
  "scriptType" TEXT NOT NULL DEFAULT '',
  "isAsync" BOOLEAN NOT NULL DEFAULT false,
  "isDefer" BOOLEAN NOT NULL DEFAULT false,
  "attributes" JSONB NOT NULL DEFAULT '[]',
  "scope" "SeoScriptScope" NOT NULL DEFAULT 'ALL',
  "pathPatterns" JSONB NOT NULL DEFAULT '[]',
  "consentCategory" "SeoConsentCategory" NOT NULL DEFAULT 'ANALYTICS',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeoScript_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SeoScript_displayOrder_idx" ON "SeoScript"("displayOrder");
CREATE INDEX IF NOT EXISTS "SeoScript_isActive_deletedAt_idx" ON "SeoScript"("isActive", "deletedAt");

CREATE TABLE IF NOT EXISTS "SeoIntegration" (
  "id" TEXT NOT NULL,
  "provider" "SeoIntegrationProvider" NOT NULL,
  "label" TEXT NOT NULL DEFAULT '',
  "trackingId" TEXT NOT NULL DEFAULT '',
  "secondaryId" TEXT NOT NULL DEFAULT '',
  "config" JSONB NOT NULL DEFAULT '{}',
  "notes" TEXT NOT NULL DEFAULT '',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeoIntegration_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SeoIntegration_provider_idx" ON "SeoIntegration"("provider");
CREATE INDEX IF NOT EXISTS "SeoIntegration_displayOrder_idx" ON "SeoIntegration"("displayOrder");
CREATE INDEX IF NOT EXISTS "SeoIntegration_isActive_deletedAt_idx" ON "SeoIntegration"("isActive", "deletedAt");

CREATE TABLE IF NOT EXISTS "SeoRobotsRule" (
  "id" TEXT NOT NULL,
  "userAgent" TEXT NOT NULL,
  "allowPaths" JSONB NOT NULL DEFAULT '[]',
  "disallowPaths" JSONB NOT NULL DEFAULT '[]',
  "crawlDelay" INTEGER,
  "notes" TEXT NOT NULL DEFAULT '',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeoRobotsRule_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SeoRobotsRule_displayOrder_idx" ON "SeoRobotsRule"("displayOrder");
CREATE INDEX IF NOT EXISTS "SeoRobotsRule_isActive_deletedAt_idx" ON "SeoRobotsRule"("isActive", "deletedAt");

CREATE TABLE IF NOT EXISTS "SeoSitemapEntry" (
  "id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "changeFrequency" "SeoChangeFrequency" NOT NULL DEFAULT 'MONTHLY',
  "priority" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  "lastModified" TIMESTAMP(3),
  "imageUrls" JSONB NOT NULL DEFAULT '[]',
  "notes" TEXT NOT NULL DEFAULT '',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeoSitemapEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SeoSitemapEntry_url_key" ON "SeoSitemapEntry"("url");
CREATE INDEX IF NOT EXISTS "SeoSitemapEntry_displayOrder_idx" ON "SeoSitemapEntry"("displayOrder");
CREATE INDEX IF NOT EXISTS "SeoSitemapEntry_isActive_deletedAt_idx" ON "SeoSitemapEntry"("isActive", "deletedAt");

CREATE TABLE IF NOT EXISTS "SeoFaq" (
  "id" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "scope" "SeoScopeKind" NOT NULL DEFAULT 'GLOBAL',
  "pagePath" TEXT NOT NULL DEFAULT '',
  "category" TEXT NOT NULL DEFAULT '',
  "keywords" TEXT NOT NULL DEFAULT '',
  "isSpeakable" BOOLEAN NOT NULL DEFAULT true,
  "showOnPage" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeoFaq_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SeoFaq_displayOrder_idx" ON "SeoFaq"("displayOrder");
CREATE INDEX IF NOT EXISTS "SeoFaq_scope_pagePath_idx" ON "SeoFaq"("scope", "pagePath");
CREATE INDEX IF NOT EXISTS "SeoFaq_isActive_deletedAt_idx" ON "SeoFaq"("isActive", "deletedAt");

CREATE TABLE IF NOT EXISTS "SeoSchema" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "schemaType" TEXT NOT NULL DEFAULT 'Organization',
  "jsonLd" JSONB NOT NULL DEFAULT '{}',
  "scope" "SeoScopeKind" NOT NULL DEFAULT 'GLOBAL',
  "pagePath" TEXT NOT NULL DEFAULT '',
  "notes" TEXT NOT NULL DEFAULT '',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeoSchema_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SeoSchema_displayOrder_idx" ON "SeoSchema"("displayOrder");
CREATE INDEX IF NOT EXISTS "SeoSchema_scope_pagePath_idx" ON "SeoSchema"("scope", "pagePath");
CREATE INDEX IF NOT EXISTS "SeoSchema_isActive_deletedAt_idx" ON "SeoSchema"("isActive", "deletedAt");
