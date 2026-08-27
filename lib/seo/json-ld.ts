import { resolveOrigin, toAbsoluteUrl } from "@/lib/seo/metadata";
import { SEO_ORGANIZATION_SCHEMA_TYPE, type BreadcrumbEntry, type SeoFaqItem, type SeoSettingsContent } from "@/lib/seo/types";

type JsonObject = Record<string, unknown>;

const DAY_URI: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

function prune(node: JsonObject): JsonObject {
  const output: JsonObject = {};
  for (const [key, value] of Object.entries(node)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim().length === 0) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === "object" && !Array.isArray(value)) {
      const nested = prune(value as JsonObject);
      if (Object.keys(nested).length === 0) continue;
      output[key] = nested;
      continue;
    }
    output[key] = value;
  }
  return output;
}

export function organizationId(settings: SeoSettingsContent): string {
  return `${resolveOrigin(settings)}/#organization`;
}

export function websiteId(settings: SeoSettingsContent): string {
  return `${resolveOrigin(settings)}/#website`;
}

export function buildPostalAddress(settings: SeoSettingsContent): JsonObject | null {
  const address = prune({
    "@type": "PostalAddress",
    streetAddress: settings.streetAddress,
    addressLocality: settings.addressLocality,
    addressRegion: settings.addressRegion,
    postalCode: settings.postalCode,
    addressCountry: settings.addressCountry,
  });
  return Object.keys(address).length > 1 ? address : null;
}

export function buildOrganizationNode(settings: SeoSettingsContent): JsonObject {
  const origin = resolveOrigin(settings);
  const address = buildPostalAddress(settings);
  const logoUrl = settings.organizationLogoUrl
    ? toAbsoluteUrl(settings, settings.organizationLogoUrl)
    : "";

  const openingHours = settings.openingHours.map((entry) =>
    prune({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.days.map((day) => DAY_URI[day] ?? day),
      opens: entry.opens,
      closes: entry.closes,
    }),
  );

  const contactPoints = settings.contactPoints.map((point) =>
    prune({
      "@type": "ContactPoint",
      contactType: point.contactType,
      telephone: point.telephone,
      email: point.email,
      areaServed: point.areaServed,
      availableLanguage: point.availableLanguage
        ? point.availableLanguage.split(",").map((value) => value.trim()).filter(Boolean)
        : undefined,
    }),
  );

  return prune({
    "@type": SEO_ORGANIZATION_SCHEMA_TYPE[settings.organizationType],
    "@id": organizationId(settings),
    name: settings.organizationName || settings.siteName,
    legalName: settings.organizationLegalName,
    alternateName: settings.organizationAlternateName,
    description: settings.organizationDescription || settings.defaultDescription,
    url: origin,
    logo: logoUrl
      ? prune({
          "@type": "ImageObject",
          "@id": `${origin}/#logo`,
          url: logoUrl,
          contentUrl: logoUrl,
          caption: settings.organizationName || settings.siteName,
        })
      : undefined,
    image: settings.organizationImageUrl
      ? toAbsoluteUrl(settings, settings.organizationImageUrl)
      : logoUrl || undefined,
    email: settings.contactEmail,
    telephone: settings.contactPhone,
    faxNumber: settings.faxNumber,
    foundingDate: settings.foundingDate,
    founder: settings.founderName ? { "@type": "Person", name: settings.founderName } : undefined,
    slogan: settings.slogan,
    priceRange: settings.priceRange,
    currenciesAccepted: settings.currenciesAccepted,
    paymentAccepted: settings.paymentAccepted,
    taxID: settings.taxId,
    vatID: settings.vatId,
    iso6523Code: settings.registrationNumber,
    numberOfEmployees: settings.numberOfEmployees
      ? { "@type": "QuantitativeValue", value: settings.numberOfEmployees }
      : undefined,
    address: address ?? undefined,
    geo:
      settings.latitude && settings.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: settings.latitude,
            longitude: settings.longitude,
          }
        : undefined,
    hasMap: settings.hasMapUrl,
    areaServed: settings.areaServed.map((area) => ({ "@type": "AdministrativeArea", name: area })),
    openingHoursSpecification: openingHours,
    contactPoint: contactPoints,
    knowsAbout: settings.knowsAbout,
    award: settings.awards,
    sameAs: settings.sameAs.filter(Boolean),
    aggregateRating:
      settings.aggregateRatingEnabled && settings.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: settings.ratingValue,
            reviewCount: settings.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  });
}

export function buildWebSiteNode(settings: SeoSettingsContent): JsonObject {
  const origin = resolveOrigin(settings);
  const searchTemplate = settings.searchUrlTemplate.startsWith("http")
    ? settings.searchUrlTemplate
    : `${origin}${settings.searchUrlTemplate.startsWith("/") ? "" : "/"}${settings.searchUrlTemplate}`;

  return prune({
    "@type": "WebSite",
    "@id": websiteId(settings),
    name: settings.siteName,
    alternateName: settings.siteShortName,
    description: settings.defaultDescription,
    url: origin,
    inLanguage: settings.siteLocale.replace("_", "-"),
    publisher: { "@id": organizationId(settings) },
    copyrightHolder: { "@id": organizationId(settings) },
    potentialAction: settings.searchboxEnabled
      ? {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: searchTemplate },
          "query-input": "required name=search_term_string",
        }
      : undefined,
  });
}

export function buildBreadcrumbNode(
  settings: SeoSettingsContent,
  entries: BreadcrumbEntry[],
  pageUrl: string,
): JsonObject | null {
  if (!settings.breadcrumbsEnabled || entries.length < 2) return null;
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: toAbsoluteUrl(settings, entry.path),
    })),
  };
}

export type WebPageNodeInput = {
  url: string;
  title: string;
  description: string;
  breadcrumbId?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  speakableSelectors?: string[];
  pageType?: string;
  keywords?: string;
  primaryEntityId?: string;
};

export function buildWebPageNode(
  settings: SeoSettingsContent,
  input: WebPageNodeInput,
): JsonObject | null {
  if (!settings.webPageSchemaEnabled) return null;

  const selectors =
    input.speakableSelectors && input.speakableSelectors.length
      ? input.speakableSelectors
      : settings.speakableSelectors;

  return prune({
    "@type": input.pageType ?? "WebPage",
    "@id": `${input.url}#webpage`,
    url: input.url,
    name: input.title,
    description: input.description,
    keywords: input.keywords,
    inLanguage: settings.siteLocale.replace("_", "-"),
    isPartOf: { "@id": websiteId(settings) },
    about: { "@id": organizationId(settings) },
    primaryImageOfPage: input.imageUrl
      ? { "@type": "ImageObject", url: toAbsoluteUrl(settings, input.imageUrl) }
      : undefined,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    breadcrumb: input.breadcrumbId ? { "@id": input.breadcrumbId } : undefined,
    mainEntity: input.primaryEntityId ? { "@id": input.primaryEntityId } : undefined,
    potentialAction: { "@type": "ReadAction", target: [input.url] },
    speakable:
      settings.aeoEnabled && settings.speakableEnabled && selectors.length
        ? { "@type": "SpeakableSpecification", cssSelector: selectors }
        : undefined,
  });
}

export function buildFaqNode(
  settings: SeoSettingsContent,
  faqs: SeoFaqItem[],
  pageUrl: string,
): JsonObject | null {
  if (!settings.faqSchemaEnabled || !faqs.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export type ArticleNodeInput = {
  url: string;
  headline: string;
  description: string;
  images: string[];
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  authorRole?: string;
  authorUrl?: string;
  section?: string;
  keywords?: string[];
  wordCount?: number;
  articleType?: "Article" | "BlogPosting" | "NewsArticle";
  commentCount?: number;
  speakableSelectors?: string[];
};

export function buildArticleNode(
  settings: SeoSettingsContent,
  input: ArticleNodeInput,
): JsonObject {
  const selectors =
    input.speakableSelectors && input.speakableSelectors.length
      ? input.speakableSelectors
      : settings.speakableSelectors;

  return prune({
    "@type": input.articleType ?? "BlogPosting",
    "@id": `${input.url}#article`,
    isPartOf: { "@id": `${input.url}#webpage` },
    mainEntityOfPage: { "@id": `${input.url}#webpage` },
    headline: input.headline.slice(0, 110),
    name: input.headline,
    description: input.description,
    image: input.images.map((image) => toAbsoluteUrl(settings, image)),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    inLanguage: settings.siteLocale.replace("_", "-"),
    wordCount: input.wordCount,
    articleSection: input.section,
    keywords: input.keywords?.length ? input.keywords.join(", ") : undefined,
    commentCount: input.commentCount,
    author: input.authorName
      ? prune({
          "@type": "Person",
          name: input.authorName,
          jobTitle: input.authorRole,
          url: input.authorUrl ? toAbsoluteUrl(settings, input.authorUrl) : undefined,
        })
      : { "@id": organizationId(settings) },
    publisher: { "@id": organizationId(settings) },
    copyrightHolder: { "@id": organizationId(settings) },
    speakable:
      settings.aeoEnabled && settings.speakableEnabled && selectors.length
        ? { "@type": "SpeakableSpecification", cssSelector: selectors }
        : undefined,
  });
}

export type ServiceNodeInput = {
  url: string;
  name: string;
  description: string;
  imageUrl?: string;
  category?: string;
  serviceType?: string;
};

export function buildServiceNode(
  settings: SeoSettingsContent,
  input: ServiceNodeInput,
): JsonObject {
  return prune({
    "@type": "Service",
    "@id": `${input.url}#service`,
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.imageUrl ? toAbsoluteUrl(settings, input.imageUrl) : undefined,
    category: input.category,
    serviceType: input.serviceType ?? input.name,
    provider: { "@id": organizationId(settings) },
    areaServed: settings.areaServed.map((area) => ({ "@type": "AdministrativeArea", name: area })),
  });
}

export function buildServiceListNode(
  settings: SeoSettingsContent,
  pageUrl: string,
  services: Array<{ name: string; description: string; url: string }>,
): JsonObject | null {
  if (!services.length) return null;
  return {
    "@type": "ItemList",
    "@id": `${pageUrl}#services`,
    name: "Services",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.name,
      description: service.description,
      url: toAbsoluteUrl(settings, service.url),
    })),
  };
}

export function buildPersonNode(
  settings: SeoSettingsContent,
  input: {
    url: string;
    name: string;
    role?: string;
    bio?: string;
    imageUrl?: string;
    sameAs?: string[];
  },
): JsonObject {
  return prune({
    "@type": "Person",
    "@id": `${input.url}#person`,
    name: input.name,
    jobTitle: input.role,
    description: input.bio,
    url: input.url,
    image: input.imageUrl ? toAbsoluteUrl(settings, input.imageUrl) : undefined,
    worksFor: { "@id": organizationId(settings) },
    sameAs: input.sameAs?.filter(Boolean),
  });
}

export function buildCollectionPageNode(
  settings: SeoSettingsContent,
  input: {
    url: string;
    name: string;
    description: string;
    items: Array<{ name: string; url: string; description?: string; image?: string }>;
  },
): JsonObject {
  return prune({
    "@type": "CollectionPage",
    "@id": `${input.url}#collection`,
    url: input.url,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": websiteId(settings) },
    inLanguage: settings.siteLocale.replace("_", "-"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: toAbsoluteUrl(settings, item.url),
        name: item.name,
      })),
    },
  });
}

export function buildGraph(nodes: Array<JsonObject | null | undefined>) {
  const graph = nodes.filter((node): node is JsonObject => Boolean(node));
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function normalizeCustomJsonLd(value: unknown): JsonObject | JsonObject[] | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    const list = value.filter((entry): entry is JsonObject => Boolean(entry) && typeof entry === "object");
    return list.length ? list : null;
  }
  if (typeof value === "object") return value as JsonObject;
  if (typeof value === "string") {
    try {
      return normalizeCustomJsonLd(JSON.parse(value));
    } catch {
      return null;
    }
  }
  return null;
}
