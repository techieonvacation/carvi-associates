export const SEO_ORGANIZATION_TYPES = [
  "ORGANIZATION",
  "LOCAL_BUSINESS",
  "PROFESSIONAL_SERVICE",
  "ACCOUNTING_SERVICE",
  "FINANCIAL_SERVICE",
  "LEGAL_SERVICE",
  "CORPORATION",
  "CONSULTING_AGENCY",
] as const;
export type SeoOrganizationType = (typeof SEO_ORGANIZATION_TYPES)[number];

export const SEO_ORGANIZATION_SCHEMA_TYPE: Record<SeoOrganizationType, string> = {
  ORGANIZATION: "Organization",
  LOCAL_BUSINESS: "LocalBusiness",
  PROFESSIONAL_SERVICE: "ProfessionalService",
  ACCOUNTING_SERVICE: "AccountingService",
  FINANCIAL_SERVICE: "FinancialService",
  LEGAL_SERVICE: "LegalService",
  CORPORATION: "Corporation",
  CONSULTING_AGENCY: "ConsultingAgency",
};

export const SEO_TWITTER_CARDS = ["SUMMARY", "SUMMARY_LARGE_IMAGE", "APP", "PLAYER"] as const;
export type SeoTwitterCard = (typeof SEO_TWITTER_CARDS)[number];

export const SEO_TWITTER_CARD_VALUE: Record<SeoTwitterCard, "summary" | "summary_large_image" | "app" | "player"> = {
  SUMMARY: "summary",
  SUMMARY_LARGE_IMAGE: "summary_large_image",
  APP: "app",
  PLAYER: "player",
};

export const SEO_CHANGE_FREQUENCIES = [
  "ALWAYS",
  "HOURLY",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
  "NEVER",
] as const;
export type SeoChangeFrequency = (typeof SEO_CHANGE_FREQUENCIES)[number];

export type SitemapChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export const SEO_CHANGE_FREQUENCY_VALUE: Record<SeoChangeFrequency, SitemapChangeFrequency> = {
  ALWAYS: "always",
  HOURLY: "hourly",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
  NEVER: "never",
};

export const SEO_IMAGE_PREVIEWS = ["NONE", "STANDARD", "LARGE"] as const;
export type SeoImagePreview = (typeof SEO_IMAGE_PREVIEWS)[number];

export const SEO_IMAGE_PREVIEW_VALUE: Record<SeoImagePreview, "none" | "standard" | "large"> = {
  NONE: "none",
  STANDARD: "standard",
  LARGE: "large",
};

export const SEO_SCRIPT_PLACEMENTS = ["HEAD", "BODY_START", "BODY_END"] as const;
export type SeoScriptPlacement = (typeof SEO_SCRIPT_PLACEMENTS)[number];

export const SEO_SCRIPT_STRATEGIES = [
  "BEFORE_INTERACTIVE",
  "AFTER_INTERACTIVE",
  "LAZY_ONLOAD",
  "WORKER",
] as const;
export type SeoScriptStrategy = (typeof SEO_SCRIPT_STRATEGIES)[number];

export const SEO_SCRIPT_STRATEGY_VALUE: Record<
  SeoScriptStrategy,
  "beforeInteractive" | "afterInteractive" | "lazyOnload" | "worker"
> = {
  BEFORE_INTERACTIVE: "beforeInteractive",
  AFTER_INTERACTIVE: "afterInteractive",
  LAZY_ONLOAD: "lazyOnload",
  WORKER: "worker",
};

export const SEO_SCRIPT_SCOPES = ["ALL", "INCLUDE", "EXCLUDE"] as const;
export type SeoScriptScope = (typeof SEO_SCRIPT_SCOPES)[number];

export const SEO_CONSENT_CATEGORIES = [
  "NECESSARY",
  "ANALYTICS",
  "MARKETING",
  "PREFERENCES",
] as const;
export type SeoConsentCategory = (typeof SEO_CONSENT_CATEGORIES)[number];

export const SEO_INTEGRATION_PROVIDERS = [
  "GOOGLE_ANALYTICS",
  "GOOGLE_TAG_MANAGER",
  "GOOGLE_ADS",
  "GOOGLE_SEARCH_CONSOLE",
  "GOOGLE_OPTIMIZE",
  "BING_WEBMASTER",
  "BING_UET",
  "META_PIXEL",
  "LINKEDIN_INSIGHT",
  "TIKTOK_PIXEL",
  "PINTEREST_TAG",
  "X_PIXEL",
  "HOTJAR",
  "MICROSOFT_CLARITY",
  "PLAUSIBLE",
  "FATHOM",
  "MATOMO",
  "POSTHOG",
  "YANDEX_METRICA",
  "CRISP_CHAT",
  "TAWK_TO",
  "INTERCOM",
  "CUSTOM",
] as const;
export type SeoIntegrationProvider = (typeof SEO_INTEGRATION_PROVIDERS)[number];

export type SeoProviderMeta = {
  label: string;
  group: "Analytics" | "Tag Manager" | "Advertising" | "Verification" | "Experience";
  idLabel: string;
  idPlaceholder: string;
  secondaryLabel?: string;
  secondaryPlaceholder?: string;
  helpUrl: string;
  description: string;
};

export const SEO_PROVIDER_META: Record<SeoIntegrationProvider, SeoProviderMeta> = {
  GOOGLE_ANALYTICS: {
    label: "Google Analytics 4",
    group: "Analytics",
    idLabel: "Measurement ID",
    idPlaceholder: "G-XXXXXXXXXX",
    helpUrl: "https://analytics.google.com/",
    description: "Loads gtag.js and sends page_view events on every route change.",
  },
  GOOGLE_TAG_MANAGER: {
    label: "Google Tag Manager",
    group: "Tag Manager",
    idLabel: "Container ID",
    idPlaceholder: "GTM-XXXXXXX",
    helpUrl: "https://tagmanager.google.com/",
    description: "Injects the GTM container plus the noscript iframe fallback.",
  },
  GOOGLE_ADS: {
    label: "Google Ads",
    group: "Advertising",
    idLabel: "Conversion ID",
    idPlaceholder: "AW-XXXXXXXXX",
    secondaryLabel: "Conversion label",
    secondaryPlaceholder: "abcDEFghIJklMNo",
    helpUrl: "https://ads.google.com/",
    description: "Adds the Google Ads global site tag for remarketing and conversions.",
  },
  GOOGLE_SEARCH_CONSOLE: {
    label: "Google Search Console",
    group: "Verification",
    idLabel: "Verification token",
    idPlaceholder: "google-site-verification token",
    helpUrl: "https://search.google.com/search-console",
    description: "Adds the google-site-verification meta tag for domain ownership.",
  },
  GOOGLE_OPTIMIZE: {
    label: "Google Optimize",
    group: "Experience",
    idLabel: "Container ID",
    idPlaceholder: "OPT-XXXXXXX",
    helpUrl: "https://optimize.google.com/",
    description: "Loads the Optimize container for on-site experiments.",
  },
  BING_WEBMASTER: {
    label: "Bing Webmaster Tools",
    group: "Verification",
    idLabel: "Verification token",
    idPlaceholder: "msvalidate.01 token",
    helpUrl: "https://www.bing.com/webmasters",
    description: "Adds the msvalidate.01 meta tag used by Bing and Copilot indexing.",
  },
  BING_UET: {
    label: "Microsoft Ads UET",
    group: "Advertising",
    idLabel: "UET tag ID",
    idPlaceholder: "12345678",
    helpUrl: "https://ads.microsoft.com/",
    description: "Universal Event Tracking tag for Microsoft Advertising.",
  },
  META_PIXEL: {
    label: "Meta Pixel",
    group: "Advertising",
    idLabel: "Pixel ID",
    idPlaceholder: "123456789012345",
    helpUrl: "https://business.facebook.com/events_manager",
    description: "Facebook and Instagram conversion tracking pixel.",
  },
  LINKEDIN_INSIGHT: {
    label: "LinkedIn Insight Tag",
    group: "Advertising",
    idLabel: "Partner ID",
    idPlaceholder: "1234567",
    helpUrl: "https://www.linkedin.com/campaignmanager/",
    description: "Tracks LinkedIn ad conversions and website demographics.",
  },
  TIKTOK_PIXEL: {
    label: "TikTok Pixel",
    group: "Advertising",
    idLabel: "Pixel ID",
    idPlaceholder: "CXXXXXXXXXXXXXXXXXXX",
    helpUrl: "https://ads.tiktok.com/",
    description: "TikTok Ads conversion and audience pixel.",
  },
  PINTEREST_TAG: {
    label: "Pinterest Tag",
    group: "Advertising",
    idLabel: "Tag ID",
    idPlaceholder: "2612345678901",
    helpUrl: "https://ads.pinterest.com/",
    description: "Pinterest conversion tag for shopping and lead campaigns.",
  },
  X_PIXEL: {
    label: "X (Twitter) Pixel",
    group: "Advertising",
    idLabel: "Pixel ID",
    idPlaceholder: "o1abc",
    helpUrl: "https://ads.x.com/",
    description: "X Ads website tag for conversion tracking.",
  },
  HOTJAR: {
    label: "Hotjar",
    group: "Experience",
    idLabel: "Site ID",
    idPlaceholder: "1234567",
    helpUrl: "https://hotjar.com/",
    description: "Heatmaps and session recordings.",
  },
  MICROSOFT_CLARITY: {
    label: "Microsoft Clarity",
    group: "Experience",
    idLabel: "Project ID",
    idPlaceholder: "abcdefghij",
    helpUrl: "https://clarity.microsoft.com/",
    description: "Free session replay and heatmaps from Microsoft.",
  },
  PLAUSIBLE: {
    label: "Plausible Analytics",
    group: "Analytics",
    idLabel: "Domain",
    idPlaceholder: "carviassociates.com",
    secondaryLabel: "Script host",
    secondaryPlaceholder: "https://plausible.io",
    helpUrl: "https://plausible.io/",
    description: "Cookie-free privacy analytics.",
  },
  FATHOM: {
    label: "Fathom Analytics",
    group: "Analytics",
    idLabel: "Site ID",
    idPlaceholder: "ABCDEFGH",
    helpUrl: "https://usefathom.com/",
    description: "Privacy-first analytics with a single lightweight script.",
  },
  MATOMO: {
    label: "Matomo",
    group: "Analytics",
    idLabel: "Site ID",
    idPlaceholder: "1",
    secondaryLabel: "Matomo host",
    secondaryPlaceholder: "https://analytics.example.com",
    helpUrl: "https://matomo.org/",
    description: "Self-hosted analytics platform.",
  },
  POSTHOG: {
    label: "PostHog",
    group: "Analytics",
    idLabel: "Project API key",
    idPlaceholder: "phc_xxxxxxxx",
    secondaryLabel: "API host",
    secondaryPlaceholder: "https://eu.i.posthog.com",
    helpUrl: "https://posthog.com/",
    description: "Product analytics with autocapture.",
  },
  YANDEX_METRICA: {
    label: "Yandex Metrica",
    group: "Analytics",
    idLabel: "Counter ID",
    idPlaceholder: "12345678",
    helpUrl: "https://metrica.yandex.com/",
    description: "Yandex analytics counter with webvisor support.",
  },
  CRISP_CHAT: {
    label: "Crisp Chat",
    group: "Experience",
    idLabel: "Website ID",
    idPlaceholder: "00000000-0000-0000-0000-000000000000",
    helpUrl: "https://crisp.chat/",
    description: "Live chat widget for lead capture.",
  },
  TAWK_TO: {
    label: "Tawk.to",
    group: "Experience",
    idLabel: "Property ID",
    idPlaceholder: "5f0000000000000000000000",
    secondaryLabel: "Widget ID",
    secondaryPlaceholder: "default",
    helpUrl: "https://tawk.to/",
    description: "Free live chat and ticketing widget.",
  },
  INTERCOM: {
    label: "Intercom",
    group: "Experience",
    idLabel: "App ID",
    idPlaceholder: "abcd1234",
    helpUrl: "https://intercom.com/",
    description: "Customer messaging and support widget.",
  },
  CUSTOM: {
    label: "Custom provider",
    group: "Analytics",
    idLabel: "Identifier",
    idPlaceholder: "custom-id",
    helpUrl: "",
    description: "Placeholder entry for a vendor managed through custom scripts.",
  },
};

export const SEO_SCOPE_KINDS = ["GLOBAL", "PAGE"] as const;
export type SeoScopeKind = (typeof SEO_SCOPE_KINDS)[number];

export const SEO_REDIRECT_MATCHES = ["EXACT", "PREFIX", "REGEX"] as const;
export type SeoRedirectMatch = (typeof SEO_REDIRECT_MATCHES)[number];

export const SEO_REDIRECT_STATUS_CODES = [301, 302, 307, 308] as const;

export const AI_CRAWLER_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "Amazonbot",
  "YouBot",
  "DuckAssistBot",
  "MistralAI-User",
] as const;

export const SCHEMA_TYPE_OPTIONS = [
  "Organization",
  "LocalBusiness",
  "AccountingService",
  "ProfessionalService",
  "WebSite",
  "WebPage",
  "AboutPage",
  "ContactPage",
  "CollectionPage",
  "Service",
  "Product",
  "Article",
  "BlogPosting",
  "NewsArticle",
  "FAQPage",
  "QAPage",
  "HowTo",
  "Event",
  "Course",
  "JobPosting",
  "Person",
  "BreadcrumbList",
  "ItemList",
  "VideoObject",
  "SoftwareApplication",
  "Review",
  "Custom",
] as const;

export type SeoHreflangEntry = {
  hreflang: string;
  href: string;
};

export type SeoOpeningHour = {
  days: string[];
  opens: string;
  closes: string;
};

export type SeoContactPoint = {
  contactType: string;
  telephone: string;
  email: string;
  areaServed: string;
  availableLanguage: string;
};

export type SeoCustomVerification = {
  name: string;
  content: string;
};

export type SeoManifestIcon = {
  src: string;
  sizes: string;
  type: string;
  purpose: string;
};

export type SeoScriptAttribute = {
  name: string;
  value: string;
};

export type SeoSettingsContent = {
  siteName: string;
  siteShortName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  applyTitleTemplate: boolean;
  defaultDescription: string;
  defaultKeywords: string;
  siteLanguage: string;
  siteLocale: string;
  alternateLocales: string[];
  applicationName: string;
  publisherName: string;
  authorName: string;
  generatorName: string;
  copyrightText: string;
  categoryMeta: string;
  referrerPolicy: string;
  colorScheme: string;
  formatDetectionTelephone: boolean;
  faviconUrl: string;
  faviconSmallUrl: string;
  appleTouchIconUrl: string;
  svgIconUrl: string;
  maskIconUrl: string;
  maskIconColor: string;
  themeColorLight: string;
  themeColorDark: string;
  indexingEnabled: boolean;
  defaultNoIndex: boolean;
  defaultNoFollow: boolean;
  defaultNoArchive: boolean;
  defaultNoSnippet: boolean;
  defaultNoImageIndex: boolean;
  maxSnippet: number;
  maxImagePreview: SeoImagePreview;
  maxVideoPreview: number;
  robotsEnabled: boolean;
  robotsUseCustom: boolean;
  robotsCustomContent: string;
  robotsExtraLines: string;
  robotsHost: string;
  robotsCrawlDelay: number | null;
  blockAiCrawlers: boolean;
  allowedAiCrawlers: string[];
  sitemapEnabled: boolean;
  sitemapIncludeImages: boolean;
  sitemapIncludeBlog: boolean;
  sitemapIncludeServices: boolean;
  sitemapIncludeCategories: boolean;
  sitemapIncludeTags: boolean;
  sitemapIncludeAuthors: boolean;
  sitemapIncludePages: boolean;
  sitemapDefaultChangeFreq: SeoChangeFrequency;
  sitemapHomePriority: number;
  sitemapPagePriority: number;
  sitemapBlogPriority: number;
  sitemapPostPriority: number;
  sitemapServicePriority: number;
  sitemapMaxUrls: number;
  ogType: string;
  ogSiteName: string;
  ogImageUrl: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
  twitterCard: SeoTwitterCard;
  twitterSite: string;
  twitterCreator: string;
  twitterImageUrl: string;
  facebookAppId: string;
  facebookPageUrl: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  yandexVerification: string;
  yahooVerification: string;
  pinterestVerification: string;
  facebookDomainVerification: string;
  baiduVerification: string;
  nortonVerification: string;
  customVerifications: SeoCustomVerification[];
  organizationEnabled: boolean;
  organizationType: SeoOrganizationType;
  organizationName: string;
  organizationLegalName: string;
  organizationAlternateName: string;
  organizationDescription: string;
  organizationLogoUrl: string;
  organizationImageUrl: string;
  foundingDate: string;
  founderName: string;
  contactEmail: string;
  contactPhone: string;
  faxNumber: string;
  priceRange: string;
  currenciesAccepted: string;
  paymentAccepted: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  latitude: string;
  longitude: string;
  hasMapUrl: string;
  areaServed: string[];
  openingHours: SeoOpeningHour[];
  sameAs: string[];
  contactPoints: SeoContactPoint[];
  knowsAbout: string[];
  awards: string[];
  slogan: string;
  numberOfEmployees: number | null;
  taxId: string;
  vatId: string;
  registrationNumber: string;
  aggregateRatingEnabled: boolean;
  ratingValue: number;
  reviewCount: number;
  websiteSchemaEnabled: boolean;
  searchboxEnabled: boolean;
  searchUrlTemplate: string;
  breadcrumbsEnabled: boolean;
  webPageSchemaEnabled: boolean;
  aeoEnabled: boolean;
  speakableEnabled: boolean;
  speakableSelectors: string[];
  faqSchemaEnabled: boolean;
  qaPageEnabled: boolean;
  llmsTxtEnabled: boolean;
  llmsTxtAutoGenerate: boolean;
  llmsTxtContent: string;
  aiSummary: string;
  entityDefinition: string;
  aiAnswerTargets: string[];
  rssEnabled: boolean;
  rssTitle: string;
  rssDescription: string;
  rssItemLimit: number;
  manifestEnabled: boolean;
  manifestName: string;
  manifestShortName: string;
  manifestDescription: string;
  manifestDisplay: string;
  manifestStartUrl: string;
  manifestBackgroundColor: string;
  manifestIcons: SeoManifestIcon[];
  preconnectUrls: string[];
  dnsPrefetchUrls: string[];
  hreflangEnabled: boolean;
  hreflangEntries: SeoHreflangEntry[];
  canonicalHost: string;
  forceTrailingSlash: boolean;
  redirectsEnabled: boolean;
  indexNowEnabled: boolean;
  indexNowKey: string;
  customHeadHtml: string;
  customBodyStartHtml: string;
  customBodyEndHtml: string;
};

export type SeoPageContent = {
  id: string;
  path: string;
  label: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  ogImageAlt: string | null;
  ogType: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImageUrl: string | null;
  twitterCard: SeoTwitterCard | null;
  noIndex: boolean;
  noFollow: boolean;
  noArchive: boolean;
  noSnippet: boolean;
  noImageIndex: boolean;
  maxSnippet: number | null;
  maxImagePreview: SeoImagePreview | null;
  maxVideoPreview: number | null;
  breadcrumbLabel: string | null;
  focusKeyword: string;
  secondaryKeywords: string;
  aiSummary: string;
  speakableSelectors: string[];
  hreflangEntries: SeoHreflangEntry[];
  customJsonLd: unknown;
  includeInSitemap: boolean;
  sitemapPriority: number | null;
  sitemapChangeFreq: SeoChangeFrequency | null;
  sitemapLastMod: string | null;
  notes: string;
  displayOrder: number;
  isActive: boolean;
  deletedAt: string | null;
  updatedAt: string | null;
};

export type SeoRedirectItem = {
  id: string;
  source: string;
  destination: string;
  statusCode: number;
  matchType: SeoRedirectMatch;
  preserveQuery: boolean;
  hitCount: number;
  lastHitAt: string | null;
  notes: string;
  isActive: boolean;
  displayOrder: number;
  deletedAt: string | null;
};

export type SeoScriptItem = {
  id: string;
  name: string;
  description: string;
  placement: SeoScriptPlacement;
  strategy: SeoScriptStrategy;
  scriptSrc: string;
  inlineCode: string;
  scriptType: string;
  isAsync: boolean;
  isDefer: boolean;
  attributes: SeoScriptAttribute[];
  scope: SeoScriptScope;
  pathPatterns: string[];
  consentCategory: SeoConsentCategory;
  isActive: boolean;
  displayOrder: number;
  deletedAt: string | null;
};

export type SeoIntegrationItem = {
  id: string;
  provider: SeoIntegrationProvider;
  label: string;
  trackingId: string;
  secondaryId: string;
  config: Record<string, unknown>;
  notes: string;
  isActive: boolean;
  displayOrder: number;
  deletedAt: string | null;
};

export type SeoRobotsRuleItem = {
  id: string;
  userAgent: string;
  allowPaths: string[];
  disallowPaths: string[];
  crawlDelay: number | null;
  notes: string;
  isActive: boolean;
  displayOrder: number;
  deletedAt: string | null;
};

export type SeoSitemapEntryItem = {
  id: string;
  url: string;
  changeFrequency: SeoChangeFrequency;
  priority: number;
  lastModified: string | null;
  imageUrls: string[];
  notes: string;
  isActive: boolean;
  displayOrder: number;
  deletedAt: string | null;
};

export type SeoFaqItem = {
  id: string;
  question: string;
  answer: string;
  scope: SeoScopeKind;
  pagePath: string;
  category: string;
  keywords: string;
  isSpeakable: boolean;
  showOnPage: boolean;
  displayOrder: number;
  isActive: boolean;
  isVisible: boolean;
  deletedAt: string | null;
};

export type SeoSchemaItem = {
  id: string;
  name: string;
  schemaType: string;
  jsonLd: unknown;
  scope: SeoScopeKind;
  pagePath: string;
  notes: string;
  isActive: boolean;
  displayOrder: number;
  deletedAt: string | null;
};

export type BreadcrumbEntry = {
  name: string;
  path: string;
};

export type SeoEntityOverride = {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  canonicalUrl?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  twitterImageUrl?: string | null;
  noIndex?: boolean;
  ogType?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
};
