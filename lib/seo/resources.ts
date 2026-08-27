import { prisma } from "@/lib/prisma";
import { createCrudHandlers, type CrudDelegate } from "@/lib/seo/admin";
import {
  mapSeoFaq,
  mapSeoIntegration,
  mapSeoPage,
  mapSeoRedirect,
  mapSeoRobotsRule,
  mapSeoSchemaBlock,
  mapSeoScript,
  mapSeoSitemapEntry,
  normalizeNullable,
  normalizePath,
} from "@/lib/seo/mappers";
import { invalidateRedirectCache } from "@/lib/seo/redirects";
import {
  seoFaqSchema,
  seoIntegrationSchema,
  seoPageSchema,
  seoRedirectSchema,
  seoRobotsRuleSchema,
  seoSchemaBlockSchema,
  seoScriptSchema,
  seoSitemapEntrySchema,
} from "@/lib/seo/schemas";

const asDelegate = (value: unknown) => value as CrudDelegate;

export const seoPageResource = createCrudHandlers({
  delegate: asDelegate(prisma.seoPage),
  schema: seoPageSchema,
  map: mapSeoPage,
  collectionKey: "pages",
  itemKey: "page",
  toCreateData: (input, displayOrder) => ({
    ...toPageData(input),
    displayOrder: input.displayOrder ?? displayOrder,
  }),
  toUpdateData: (input, current) => ({
    ...toPageData(input),
    displayOrder: input.displayOrder ?? (current.displayOrder as number),
    deletedAt: null,
  }),
  duplicate: (row, displayOrder) => ({
    path: `${row.path as string}-copy-${Date.now().toString(36)}`,
    label: `${(row.label as string) || (row.path as string)} (Copy)`,
    title: row.title,
    description: row.description,
    keywords: row.keywords,
    canonicalUrl: null,
    ogTitle: row.ogTitle,
    ogDescription: row.ogDescription,
    ogImageUrl: row.ogImageUrl,
    ogImageAlt: row.ogImageAlt,
    ogType: row.ogType,
    twitterTitle: row.twitterTitle,
    twitterDescription: row.twitterDescription,
    twitterImageUrl: row.twitterImageUrl,
    twitterCard: row.twitterCard,
    noIndex: true,
    noFollow: row.noFollow,
    noArchive: row.noArchive,
    noSnippet: row.noSnippet,
    noImageIndex: row.noImageIndex,
    focusKeyword: row.focusKeyword,
    secondaryKeywords: row.secondaryKeywords,
    aiSummary: row.aiSummary,
    speakableSelectors: row.speakableSelectors,
    hreflangEntries: row.hreflangEntries,
    customJsonLd: row.customJsonLd,
    includeInSitemap: false,
    notes: row.notes,
    isActive: false,
    displayOrder,
  }),
});

function toPageData(input: ReturnType<typeof seoPageSchema.parse>) {
  return {
    path: normalizePath(input.path),
    label: input.label.trim(),
    title: normalizeNullable(input.title),
    description: normalizeNullable(input.description),
    keywords: normalizeNullable(input.keywords),
    canonicalUrl: normalizeNullable(input.canonicalUrl),
    ogTitle: normalizeNullable(input.ogTitle),
    ogDescription: normalizeNullable(input.ogDescription),
    ogImageUrl: normalizeNullable(input.ogImageUrl),
    ogImageAlt: normalizeNullable(input.ogImageAlt),
    ogType: normalizeNullable(input.ogType),
    twitterTitle: normalizeNullable(input.twitterTitle),
    twitterDescription: normalizeNullable(input.twitterDescription),
    twitterImageUrl: normalizeNullable(input.twitterImageUrl),
    twitterCard: input.twitterCard ?? null,
    noIndex: input.noIndex,
    noFollow: input.noFollow,
    noArchive: input.noArchive,
    noSnippet: input.noSnippet,
    noImageIndex: input.noImageIndex,
    maxSnippet: input.maxSnippet ?? null,
    maxImagePreview: input.maxImagePreview ?? null,
    maxVideoPreview: input.maxVideoPreview ?? null,
    breadcrumbLabel: normalizeNullable(input.breadcrumbLabel),
    focusKeyword: input.focusKeyword.trim(),
    secondaryKeywords: input.secondaryKeywords.trim(),
    aiSummary: input.aiSummary.trim(),
    speakableSelectors: input.speakableSelectors,
    hreflangEntries: input.hreflangEntries,
    customJsonLd: (input.customJsonLd ?? null) as never,
    includeInSitemap: input.includeInSitemap,
    sitemapPriority: input.sitemapPriority ?? null,
    sitemapChangeFreq: input.sitemapChangeFreq ?? null,
    sitemapLastMod: input.sitemapLastMod ? new Date(input.sitemapLastMod) : null,
    notes: input.notes.trim(),
    isActive: input.isActive,
  };
}

export const seoRedirectResource = createCrudHandlers({
  delegate: asDelegate(prisma.seoRedirect),
  schema: seoRedirectSchema,
  map: mapSeoRedirect,
  collectionKey: "redirects",
  itemKey: "redirect",
  afterMutate: invalidateRedirectCache,
  toCreateData: (input, displayOrder) => ({
    ...toRedirectData(input),
    displayOrder: input.displayOrder ?? displayOrder,
  }),
  toUpdateData: (input, current) => ({
    ...toRedirectData(input),
    displayOrder: input.displayOrder ?? (current.displayOrder as number),
    deletedAt: null,
  }),
  duplicate: (row, displayOrder) => ({
    source: `${row.source as string}-copy-${Date.now().toString(36)}`,
    destination: row.destination,
    statusCode: row.statusCode,
    matchType: row.matchType,
    preserveQuery: row.preserveQuery,
    notes: row.notes,
    isActive: false,
    displayOrder,
  }),
});

function toRedirectData(input: ReturnType<typeof seoRedirectSchema.parse>) {
  return {
    source: input.matchType === "REGEX" ? input.source.trim() : normalizePath(input.source),
    destination: input.destination.trim(),
    statusCode: input.statusCode,
    matchType: input.matchType,
    preserveQuery: input.preserveQuery,
    notes: input.notes.trim(),
    isActive: input.isActive,
  };
}

export const seoScriptResource = createCrudHandlers({
  delegate: asDelegate(prisma.seoScript),
  schema: seoScriptSchema,
  map: mapSeoScript,
  collectionKey: "scripts",
  itemKey: "script",
  toCreateData: (input, displayOrder) => ({
    ...toScriptData(input),
    displayOrder: input.displayOrder ?? displayOrder,
  }),
  toUpdateData: (input, current) => ({
    ...toScriptData(input),
    displayOrder: input.displayOrder ?? (current.displayOrder as number),
    deletedAt: null,
  }),
  duplicate: (row, displayOrder) => ({
    name: `${row.name as string} (Copy)`,
    description: row.description,
    placement: row.placement,
    strategy: row.strategy,
    scriptSrc: row.scriptSrc,
    inlineCode: row.inlineCode,
    scriptType: row.scriptType,
    isAsync: row.isAsync,
    isDefer: row.isDefer,
    attributes: row.attributes,
    scope: row.scope,
    pathPatterns: row.pathPatterns,
    consentCategory: row.consentCategory,
    isActive: false,
    displayOrder,
  }),
});

function toScriptData(input: ReturnType<typeof seoScriptSchema.parse>) {
  return {
    name: input.name.trim(),
    description: input.description.trim(),
    placement: input.placement,
    strategy: input.strategy,
    scriptSrc: input.scriptSrc.trim(),
    inlineCode: input.inlineCode.trim(),
    scriptType: input.scriptType.trim(),
    isAsync: input.isAsync,
    isDefer: input.isDefer,
    attributes: input.attributes,
    scope: input.scope,
    pathPatterns: input.pathPatterns,
    consentCategory: input.consentCategory,
    isActive: input.isActive,
  };
}

export const seoIntegrationResource = createCrudHandlers({
  delegate: asDelegate(prisma.seoIntegration),
  schema: seoIntegrationSchema,
  map: mapSeoIntegration,
  collectionKey: "integrations",
  itemKey: "integration",
  toCreateData: (input, displayOrder) => ({
    ...toIntegrationData(input),
    displayOrder: input.displayOrder ?? displayOrder,
  }),
  toUpdateData: (input, current) => ({
    ...toIntegrationData(input),
    displayOrder: input.displayOrder ?? (current.displayOrder as number),
    deletedAt: null,
  }),
  duplicate: (row, displayOrder) => ({
    provider: row.provider,
    label: `${(row.label as string) || (row.provider as string)} (Copy)`,
    trackingId: row.trackingId,
    secondaryId: row.secondaryId,
    config: row.config,
    notes: row.notes,
    isActive: false,
    displayOrder,
  }),
});

function toIntegrationData(input: ReturnType<typeof seoIntegrationSchema.parse>) {
  return {
    provider: input.provider,
    label: input.label.trim(),
    trackingId: input.trackingId.trim(),
    secondaryId: input.secondaryId.trim(),
    config: input.config as never,
    notes: input.notes.trim(),
    isActive: input.isActive,
  };
}

export const seoRobotsRuleResource = createCrudHandlers({
  delegate: asDelegate(prisma.seoRobotsRule),
  schema: seoRobotsRuleSchema,
  map: mapSeoRobotsRule,
  collectionKey: "rules",
  itemKey: "rule",
  toCreateData: (input, displayOrder) => ({
    ...toRobotsRuleData(input),
    displayOrder: input.displayOrder ?? displayOrder,
  }),
  toUpdateData: (input, current) => ({
    ...toRobotsRuleData(input),
    displayOrder: input.displayOrder ?? (current.displayOrder as number),
    deletedAt: null,
  }),
  duplicate: (row, displayOrder) => ({
    userAgent: `${row.userAgent as string}`,
    allowPaths: row.allowPaths,
    disallowPaths: row.disallowPaths,
    crawlDelay: row.crawlDelay,
    notes: row.notes,
    isActive: false,
    displayOrder,
  }),
});

function toRobotsRuleData(input: ReturnType<typeof seoRobotsRuleSchema.parse>) {
  return {
    userAgent: input.userAgent.trim(),
    allowPaths: input.allowPaths,
    disallowPaths: input.disallowPaths,
    crawlDelay: input.crawlDelay ?? null,
    notes: input.notes.trim(),
    isActive: input.isActive,
  };
}

export const seoSitemapEntryResource = createCrudHandlers({
  delegate: asDelegate(prisma.seoSitemapEntry),
  schema: seoSitemapEntrySchema,
  map: mapSeoSitemapEntry,
  collectionKey: "entries",
  itemKey: "entry",
  toCreateData: (input, displayOrder) => ({
    ...toSitemapEntryData(input),
    displayOrder: input.displayOrder ?? displayOrder,
  }),
  toUpdateData: (input, current) => ({
    ...toSitemapEntryData(input),
    displayOrder: input.displayOrder ?? (current.displayOrder as number),
    deletedAt: null,
  }),
});

function toSitemapEntryData(input: ReturnType<typeof seoSitemapEntrySchema.parse>) {
  return {
    url: input.url.trim(),
    changeFrequency: input.changeFrequency,
    priority: input.priority,
    lastModified: input.lastModified ? new Date(input.lastModified) : null,
    imageUrls: input.imageUrls,
    notes: input.notes.trim(),
    isActive: input.isActive,
  };
}

export const seoFaqResource = createCrudHandlers({
  delegate: asDelegate(prisma.seoFaq),
  schema: seoFaqSchema,
  map: mapSeoFaq,
  collectionKey: "faqs",
  itemKey: "faq",
  supportsVisibility: true,
  toCreateData: (input, displayOrder) => ({
    ...toFaqData(input),
    displayOrder: input.displayOrder ?? displayOrder,
  }),
  toUpdateData: (input, current) => ({
    ...toFaqData(input),
    displayOrder: input.displayOrder ?? (current.displayOrder as number),
    deletedAt: null,
  }),
  duplicate: (row, displayOrder) => ({
    question: `${row.question as string} (Copy)`,
    answer: row.answer,
    scope: row.scope,
    pagePath: row.pagePath,
    category: row.category,
    keywords: row.keywords,
    isSpeakable: row.isSpeakable,
    showOnPage: row.showOnPage,
    isActive: false,
    isVisible: false,
    displayOrder,
  }),
});

function toFaqData(input: ReturnType<typeof seoFaqSchema.parse>) {
  return {
    question: input.question.trim(),
    answer: input.answer.trim(),
    scope: input.scope,
    pagePath: input.scope === "PAGE" ? normalizePath(input.pagePath || "/") : "",
    category: input.category.trim(),
    keywords: input.keywords.trim(),
    isSpeakable: input.isSpeakable,
    showOnPage: input.showOnPage,
    isActive: input.isActive,
    isVisible: input.isVisible,
  };
}

export const seoSchemaResource = createCrudHandlers({
  delegate: asDelegate(prisma.seoSchema),
  schema: seoSchemaBlockSchema,
  map: mapSeoSchemaBlock,
  collectionKey: "schemas",
  itemKey: "schema",
  toCreateData: (input, displayOrder) => ({
    ...toSchemaData(input),
    displayOrder: input.displayOrder ?? displayOrder,
  }),
  toUpdateData: (input, current) => ({
    ...toSchemaData(input),
    displayOrder: input.displayOrder ?? (current.displayOrder as number),
    deletedAt: null,
  }),
  duplicate: (row, displayOrder) => ({
    name: `${row.name as string} (Copy)`,
    schemaType: row.schemaType,
    jsonLd: row.jsonLd,
    scope: row.scope,
    pagePath: row.pagePath,
    notes: row.notes,
    isActive: false,
    displayOrder,
  }),
});

function toSchemaData(input: ReturnType<typeof seoSchemaBlockSchema.parse>) {
  return {
    name: input.name.trim(),
    schemaType: input.schemaType.trim(),
    jsonLd: (input.jsonLd ?? {}) as never,
    scope: input.scope,
    pagePath: input.scope === "PAGE" ? normalizePath(input.pagePath || "/") : "",
    notes: input.notes.trim(),
    isActive: input.isActive,
  };
}
