import { defaultSeoSettings } from "@/lib/seo/defaults";
import type {
  SeoContactPoint,
  SeoCustomVerification,
  SeoFaqItem,
  SeoHreflangEntry,
  SeoIntegrationItem,
  SeoManifestIcon,
  SeoOpeningHour,
  SeoPageContent,
  SeoRedirectItem,
  SeoRobotsRuleItem,
  SeoSchemaItem,
  SeoScriptAttribute,
  SeoScriptItem,
  SeoSettingsContent,
  SeoSitemapEntryItem,
} from "@/lib/seo/types";

export function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter((entry) => entry.length > 0);
}

export function toHreflangEntries(value: unknown): SeoHreflangEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const row = entry as Record<string, unknown>;
    const hreflang = typeof row.hreflang === "string" ? row.hreflang.trim() : "";
    const href = typeof row.href === "string" ? row.href.trim() : "";
    if (!hreflang || !href) return [];
    return [{ hreflang, href }];
  });
}

export function toOpeningHours(value: unknown): SeoOpeningHour[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const row = entry as Record<string, unknown>;
    const days = toStringList(row.days);
    const opens = typeof row.opens === "string" ? row.opens.trim() : "";
    const closes = typeof row.closes === "string" ? row.closes.trim() : "";
    if (!days.length || !opens || !closes) return [];
    return [{ days, opens, closes }];
  });
}

export function toContactPoints(value: unknown): SeoContactPoint[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const row = entry as Record<string, unknown>;
    const contactType = typeof row.contactType === "string" ? row.contactType.trim() : "";
    if (!contactType) return [];
    return [
      {
        contactType,
        telephone: typeof row.telephone === "string" ? row.telephone.trim() : "",
        email: typeof row.email === "string" ? row.email.trim() : "",
        areaServed: typeof row.areaServed === "string" ? row.areaServed.trim() : "",
        availableLanguage:
          typeof row.availableLanguage === "string" ? row.availableLanguage.trim() : "",
      },
    ];
  });
}

export function toCustomVerifications(value: unknown): SeoCustomVerification[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const row = entry as Record<string, unknown>;
    const name = typeof row.name === "string" ? row.name.trim() : "";
    const content = typeof row.content === "string" ? row.content.trim() : "";
    if (!name || !content) return [];
    return [{ name, content }];
  });
}

export function toManifestIcons(value: unknown): SeoManifestIcon[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const row = entry as Record<string, unknown>;
    const src = typeof row.src === "string" ? row.src.trim() : "";
    if (!src) return [];
    return [
      {
        src,
        sizes: typeof row.sizes === "string" ? row.sizes.trim() : "512x512",
        type: typeof row.type === "string" ? row.type.trim() : "image/png",
        purpose: typeof row.purpose === "string" ? row.purpose.trim() : "any",
      },
    ];
  });
}

export function toScriptAttributes(value: unknown): SeoScriptAttribute[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const row = entry as Record<string, unknown>;
    const name = typeof row.name === "string" ? row.name.trim() : "";
    if (!name) return [];
    return [{ name, value: typeof row.value === "string" ? row.value : "" }];
  });
}

export function toConfigRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

export function normalizeNullable(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function normalizePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "/";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const withoutQuery = withSlash.split("?")[0].split("#")[0];
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.replace(/\/+$/, "");
  }
  return withoutQuery;
}

type SeoSettingsRow = Record<string, unknown>;

export function mapSeoSettings(row: SeoSettingsRow | null): SeoSettingsContent {
  if (!row) return defaultSeoSettings;

  const pick = <K extends keyof SeoSettingsContent>(key: K): SeoSettingsContent[K] => {
    const value = row[key as string];
    return (value === undefined || value === null
      ? defaultSeoSettings[key]
      : value) as SeoSettingsContent[K];
  };

  return {
    ...defaultSeoSettings,
    siteName: pick("siteName"),
    siteShortName: pick("siteShortName"),
    siteUrl: pick("siteUrl"),
    defaultTitle: pick("defaultTitle"),
    titleTemplate: pick("titleTemplate"),
    applyTitleTemplate: pick("applyTitleTemplate"),
    defaultDescription: pick("defaultDescription"),
    defaultKeywords: pick("defaultKeywords"),
    siteLanguage: pick("siteLanguage"),
    siteLocale: pick("siteLocale"),
    alternateLocales: toStringList(row.alternateLocales),
    applicationName: pick("applicationName"),
    publisherName: pick("publisherName"),
    authorName: pick("authorName"),
    generatorName: pick("generatorName"),
    copyrightText: pick("copyrightText"),
    categoryMeta: pick("categoryMeta"),
    referrerPolicy: pick("referrerPolicy"),
    colorScheme: pick("colorScheme"),
    formatDetectionTelephone: pick("formatDetectionTelephone"),
    faviconUrl: pick("faviconUrl"),
    faviconSmallUrl: pick("faviconSmallUrl"),
    appleTouchIconUrl: pick("appleTouchIconUrl"),
    svgIconUrl: pick("svgIconUrl"),
    maskIconUrl: pick("maskIconUrl"),
    maskIconColor: pick("maskIconColor"),
    themeColorLight: pick("themeColorLight"),
    themeColorDark: pick("themeColorDark"),
    indexingEnabled: pick("indexingEnabled"),
    defaultNoIndex: pick("defaultNoIndex"),
    defaultNoFollow: pick("defaultNoFollow"),
    defaultNoArchive: pick("defaultNoArchive"),
    defaultNoSnippet: pick("defaultNoSnippet"),
    defaultNoImageIndex: pick("defaultNoImageIndex"),
    maxSnippet: pick("maxSnippet"),
    maxImagePreview: pick("maxImagePreview"),
    maxVideoPreview: pick("maxVideoPreview"),
    robotsEnabled: pick("robotsEnabled"),
    robotsUseCustom: pick("robotsUseCustom"),
    robotsCustomContent: pick("robotsCustomContent"),
    robotsExtraLines: pick("robotsExtraLines"),
    robotsHost: pick("robotsHost"),
    robotsCrawlDelay: (row.robotsCrawlDelay ?? null) as number | null,
    blockAiCrawlers: pick("blockAiCrawlers"),
    allowedAiCrawlers: toStringList(row.allowedAiCrawlers),
    sitemapEnabled: pick("sitemapEnabled"),
    sitemapIncludeImages: pick("sitemapIncludeImages"),
    sitemapIncludeBlog: pick("sitemapIncludeBlog"),
    sitemapIncludeServices: pick("sitemapIncludeServices"),
    sitemapIncludeCategories: pick("sitemapIncludeCategories"),
    sitemapIncludeTags: pick("sitemapIncludeTags"),
    sitemapIncludeAuthors: pick("sitemapIncludeAuthors"),
    sitemapIncludePages: pick("sitemapIncludePages"),
    sitemapDefaultChangeFreq: pick("sitemapDefaultChangeFreq"),
    sitemapHomePriority: pick("sitemapHomePriority"),
    sitemapPagePriority: pick("sitemapPagePriority"),
    sitemapBlogPriority: pick("sitemapBlogPriority"),
    sitemapPostPriority: pick("sitemapPostPriority"),
    sitemapServicePriority: pick("sitemapServicePriority"),
    sitemapMaxUrls: pick("sitemapMaxUrls"),
    ogType: pick("ogType"),
    ogSiteName: pick("ogSiteName"),
    ogImageUrl: pick("ogImageUrl"),
    ogImageAlt: pick("ogImageAlt"),
    ogImageWidth: pick("ogImageWidth"),
    ogImageHeight: pick("ogImageHeight"),
    twitterCard: pick("twitterCard"),
    twitterSite: pick("twitterSite"),
    twitterCreator: pick("twitterCreator"),
    twitterImageUrl: pick("twitterImageUrl"),
    facebookAppId: pick("facebookAppId"),
    facebookPageUrl: pick("facebookPageUrl"),
    googleSiteVerification: pick("googleSiteVerification"),
    bingSiteVerification: pick("bingSiteVerification"),
    yandexVerification: pick("yandexVerification"),
    yahooVerification: pick("yahooVerification"),
    pinterestVerification: pick("pinterestVerification"),
    facebookDomainVerification: pick("facebookDomainVerification"),
    baiduVerification: pick("baiduVerification"),
    nortonVerification: pick("nortonVerification"),
    customVerifications: toCustomVerifications(row.customVerifications),
    organizationEnabled: pick("organizationEnabled"),
    organizationType: pick("organizationType"),
    organizationName: pick("organizationName"),
    organizationLegalName: pick("organizationLegalName"),
    organizationAlternateName: pick("organizationAlternateName"),
    organizationDescription: pick("organizationDescription"),
    organizationLogoUrl: pick("organizationLogoUrl"),
    organizationImageUrl: pick("organizationImageUrl"),
    foundingDate: pick("foundingDate"),
    founderName: pick("founderName"),
    contactEmail: pick("contactEmail"),
    contactPhone: pick("contactPhone"),
    faxNumber: pick("faxNumber"),
    priceRange: pick("priceRange"),
    currenciesAccepted: pick("currenciesAccepted"),
    paymentAccepted: pick("paymentAccepted"),
    streetAddress: pick("streetAddress"),
    addressLocality: pick("addressLocality"),
    addressRegion: pick("addressRegion"),
    postalCode: pick("postalCode"),
    addressCountry: pick("addressCountry"),
    latitude: pick("latitude"),
    longitude: pick("longitude"),
    hasMapUrl: pick("hasMapUrl"),
    areaServed: toStringList(row.areaServed),
    openingHours: toOpeningHours(row.openingHours),
    sameAs: toStringList(row.sameAs),
    contactPoints: toContactPoints(row.contactPoints),
    knowsAbout: toStringList(row.knowsAbout),
    awards: toStringList(row.awards),
    slogan: pick("slogan"),
    numberOfEmployees: (row.numberOfEmployees ?? null) as number | null,
    taxId: pick("taxId"),
    vatId: pick("vatId"),
    registrationNumber: pick("registrationNumber"),
    aggregateRatingEnabled: pick("aggregateRatingEnabled"),
    ratingValue: pick("ratingValue"),
    reviewCount: pick("reviewCount"),
    websiteSchemaEnabled: pick("websiteSchemaEnabled"),
    searchboxEnabled: pick("searchboxEnabled"),
    searchUrlTemplate: pick("searchUrlTemplate"),
    breadcrumbsEnabled: pick("breadcrumbsEnabled"),
    webPageSchemaEnabled: pick("webPageSchemaEnabled"),
    aeoEnabled: pick("aeoEnabled"),
    speakableEnabled: pick("speakableEnabled"),
    speakableSelectors: toStringList(row.speakableSelectors),
    faqSchemaEnabled: pick("faqSchemaEnabled"),
    qaPageEnabled: pick("qaPageEnabled"),
    llmsTxtEnabled: pick("llmsTxtEnabled"),
    llmsTxtAutoGenerate: pick("llmsTxtAutoGenerate"),
    llmsTxtContent: pick("llmsTxtContent"),
    aiSummary: pick("aiSummary"),
    entityDefinition: pick("entityDefinition"),
    aiAnswerTargets: toStringList(row.aiAnswerTargets),
    rssEnabled: pick("rssEnabled"),
    rssTitle: pick("rssTitle"),
    rssDescription: pick("rssDescription"),
    rssItemLimit: pick("rssItemLimit"),
    manifestEnabled: pick("manifestEnabled"),
    manifestName: pick("manifestName"),
    manifestShortName: pick("manifestShortName"),
    manifestDescription: pick("manifestDescription"),
    manifestDisplay: pick("manifestDisplay"),
    manifestStartUrl: pick("manifestStartUrl"),
    manifestBackgroundColor: pick("manifestBackgroundColor"),
    manifestIcons: toManifestIcons(row.manifestIcons),
    preconnectUrls: toStringList(row.preconnectUrls),
    dnsPrefetchUrls: toStringList(row.dnsPrefetchUrls),
    hreflangEnabled: pick("hreflangEnabled"),
    hreflangEntries: toHreflangEntries(row.hreflangEntries),
    canonicalHost: pick("canonicalHost"),
    forceTrailingSlash: pick("forceTrailingSlash"),
    redirectsEnabled: pick("redirectsEnabled"),
    indexNowEnabled: pick("indexNowEnabled"),
    indexNowKey: pick("indexNowKey"),
    customHeadHtml: pick("customHeadHtml"),
    customBodyStartHtml: pick("customBodyStartHtml"),
    customBodyEndHtml: pick("customBodyEndHtml"),
  };
}

export function mapSeoPage(row: Record<string, unknown>): SeoPageContent {
  return {
    id: row.id as string,
    path: row.path as string,
    label: (row.label as string) ?? "",
    title: (row.title as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    keywords: (row.keywords as string | null) ?? null,
    canonicalUrl: (row.canonicalUrl as string | null) ?? null,
    ogTitle: (row.ogTitle as string | null) ?? null,
    ogDescription: (row.ogDescription as string | null) ?? null,
    ogImageUrl: (row.ogImageUrl as string | null) ?? null,
    ogImageAlt: (row.ogImageAlt as string | null) ?? null,
    ogType: (row.ogType as string | null) ?? null,
    twitterTitle: (row.twitterTitle as string | null) ?? null,
    twitterDescription: (row.twitterDescription as string | null) ?? null,
    twitterImageUrl: (row.twitterImageUrl as string | null) ?? null,
    twitterCard: (row.twitterCard as SeoPageContent["twitterCard"]) ?? null,
    noIndex: Boolean(row.noIndex),
    noFollow: Boolean(row.noFollow),
    noArchive: Boolean(row.noArchive),
    noSnippet: Boolean(row.noSnippet),
    noImageIndex: Boolean(row.noImageIndex),
    maxSnippet: (row.maxSnippet as number | null) ?? null,
    maxImagePreview: (row.maxImagePreview as SeoPageContent["maxImagePreview"]) ?? null,
    maxVideoPreview: (row.maxVideoPreview as number | null) ?? null,
    breadcrumbLabel: (row.breadcrumbLabel as string | null) ?? null,
    focusKeyword: (row.focusKeyword as string) ?? "",
    secondaryKeywords: (row.secondaryKeywords as string) ?? "",
    aiSummary: (row.aiSummary as string) ?? "",
    speakableSelectors: toStringList(row.speakableSelectors),
    hreflangEntries: toHreflangEntries(row.hreflangEntries),
    customJsonLd: row.customJsonLd ?? null,
    includeInSitemap: row.includeInSitemap !== false,
    sitemapPriority: (row.sitemapPriority as number | null) ?? null,
    sitemapChangeFreq: (row.sitemapChangeFreq as SeoPageContent["sitemapChangeFreq"]) ?? null,
    sitemapLastMod: row.sitemapLastMod ? new Date(row.sitemapLastMod as string).toISOString() : null,
    notes: (row.notes as string) ?? "",
    displayOrder: (row.displayOrder as number) ?? 0,
    isActive: row.isActive !== false,
    deletedAt: row.deletedAt ? new Date(row.deletedAt as string).toISOString() : null,
    updatedAt: row.updatedAt ? new Date(row.updatedAt as string).toISOString() : null,
  };
}

export function mapSeoRedirect(row: Record<string, unknown>): SeoRedirectItem {
  return {
    id: row.id as string,
    source: row.source as string,
    destination: row.destination as string,
    statusCode: (row.statusCode as number) ?? 308,
    matchType: (row.matchType as SeoRedirectItem["matchType"]) ?? "EXACT",
    preserveQuery: row.preserveQuery !== false,
    hitCount: (row.hitCount as number) ?? 0,
    lastHitAt: row.lastHitAt ? new Date(row.lastHitAt as string).toISOString() : null,
    notes: (row.notes as string) ?? "",
    isActive: row.isActive !== false,
    displayOrder: (row.displayOrder as number) ?? 0,
    deletedAt: row.deletedAt ? new Date(row.deletedAt as string).toISOString() : null,
  };
}

export function mapSeoScript(row: Record<string, unknown>): SeoScriptItem {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    placement: (row.placement as SeoScriptItem["placement"]) ?? "HEAD",
    strategy: (row.strategy as SeoScriptItem["strategy"]) ?? "AFTER_INTERACTIVE",
    scriptSrc: (row.scriptSrc as string) ?? "",
    inlineCode: (row.inlineCode as string) ?? "",
    scriptType: (row.scriptType as string) ?? "",
    isAsync: Boolean(row.isAsync),
    isDefer: Boolean(row.isDefer),
    attributes: toScriptAttributes(row.attributes),
    scope: (row.scope as SeoScriptItem["scope"]) ?? "ALL",
    pathPatterns: toStringList(row.pathPatterns),
    consentCategory: (row.consentCategory as SeoScriptItem["consentCategory"]) ?? "ANALYTICS",
    isActive: row.isActive !== false,
    displayOrder: (row.displayOrder as number) ?? 0,
    deletedAt: row.deletedAt ? new Date(row.deletedAt as string).toISOString() : null,
  };
}

export function mapSeoIntegration(row: Record<string, unknown>): SeoIntegrationItem {
  return {
    id: row.id as string,
    provider: row.provider as SeoIntegrationItem["provider"],
    label: (row.label as string) ?? "",
    trackingId: (row.trackingId as string) ?? "",
    secondaryId: (row.secondaryId as string) ?? "",
    config: toConfigRecord(row.config),
    notes: (row.notes as string) ?? "",
    isActive: row.isActive !== false,
    displayOrder: (row.displayOrder as number) ?? 0,
    deletedAt: row.deletedAt ? new Date(row.deletedAt as string).toISOString() : null,
  };
}

export function mapSeoRobotsRule(row: Record<string, unknown>): SeoRobotsRuleItem {
  return {
    id: row.id as string,
    userAgent: row.userAgent as string,
    allowPaths: toStringList(row.allowPaths),
    disallowPaths: toStringList(row.disallowPaths),
    crawlDelay: (row.crawlDelay as number | null) ?? null,
    notes: (row.notes as string) ?? "",
    isActive: row.isActive !== false,
    displayOrder: (row.displayOrder as number) ?? 0,
    deletedAt: row.deletedAt ? new Date(row.deletedAt as string).toISOString() : null,
  };
}

export function mapSeoSitemapEntry(row: Record<string, unknown>): SeoSitemapEntryItem {
  return {
    id: row.id as string,
    url: row.url as string,
    changeFrequency:
      (row.changeFrequency as SeoSitemapEntryItem["changeFrequency"]) ?? "MONTHLY",
    priority: (row.priority as number) ?? 0.5,
    lastModified: row.lastModified ? new Date(row.lastModified as string).toISOString() : null,
    imageUrls: toStringList(row.imageUrls),
    notes: (row.notes as string) ?? "",
    isActive: row.isActive !== false,
    displayOrder: (row.displayOrder as number) ?? 0,
    deletedAt: row.deletedAt ? new Date(row.deletedAt as string).toISOString() : null,
  };
}

export function mapSeoFaq(row: Record<string, unknown>): SeoFaqItem {
  return {
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string,
    scope: (row.scope as SeoFaqItem["scope"]) ?? "GLOBAL",
    pagePath: (row.pagePath as string) ?? "",
    category: (row.category as string) ?? "",
    keywords: (row.keywords as string) ?? "",
    isSpeakable: row.isSpeakable !== false,
    showOnPage: row.showOnPage !== false,
    displayOrder: (row.displayOrder as number) ?? 0,
    isActive: row.isActive !== false,
    isVisible: row.isVisible !== false,
    deletedAt: row.deletedAt ? new Date(row.deletedAt as string).toISOString() : null,
  };
}

export function mapSeoSchemaBlock(row: Record<string, unknown>): SeoSchemaItem {
  return {
    id: row.id as string,
    name: row.name as string,
    schemaType: (row.schemaType as string) ?? "Organization",
    jsonLd: row.jsonLd ?? {},
    scope: (row.scope as SeoSchemaItem["scope"]) ?? "GLOBAL",
    pagePath: (row.pagePath as string) ?? "",
    notes: (row.notes as string) ?? "",
    isActive: row.isActive !== false,
    displayOrder: (row.displayOrder as number) ?? 0,
    deletedAt: row.deletedAt ? new Date(row.deletedAt as string).toISOString() : null,
  };
}
