import type { Metadata } from "next";
import { getSeoIntegrations, getSeoPage, getSeoSettings } from "@/lib/seo/queries";
import { integrationMetaTags } from "@/lib/seo/providers";
import { normalizePath } from "@/lib/seo/mappers";
import type { SeoIntegrationItem } from "@/lib/seo/types";
import {
  SEO_IMAGE_PREVIEW_VALUE,
  SEO_TWITTER_CARD_VALUE,
  type SeoEntityOverride,
  type SeoPageContent,
  type SeoSettingsContent,
} from "@/lib/seo/types";

export function resolveOrigin(settings: SeoSettingsContent): string {
  const host = settings.canonicalHost.trim() || settings.siteUrl.trim();
  if (!host) return "";
  const withProtocol = host.startsWith("http") ? host : `https://${host}`;
  return withProtocol.replace(/\/+$/, "");
}

export function toAbsoluteUrl(settings: SeoSettingsContent, path: string): string {
  const value = path.trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const origin = resolveOrigin(settings);
  const suffix = value.startsWith("/") ? value : `/${value}`;
  return `${origin}${suffix}`;
}

export function canonicalPath(settings: SeoSettingsContent, path: string): string {
  const normalized = normalizePath(path);
  if (normalized === "/") return "/";
  return settings.forceTrailingSlash ? `${normalized}/` : normalized;
}

function firstNonEmpty(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length) return value.trim();
  }
  return "";
}

function applyTemplate(settings: SeoSettingsContent, title: string, isHome: boolean): string {
  if (!settings.applyTitleTemplate) return title;
  const template = settings.titleTemplate.trim();
  if (!template || !template.includes("%s")) return title;
  if (isHome) return title;
  const rendered = template.replace("%s", title);
  return title.includes(settings.siteName) ? title : rendered;
}

function buildRobots(
  settings: SeoSettingsContent,
  page: SeoPageContent | null,
  entity: SeoEntityOverride,
): Metadata["robots"] {
  const noIndex =
    !settings.indexingEnabled ||
    settings.defaultNoIndex ||
    Boolean(page?.noIndex) ||
    Boolean(entity.noIndex);
  const noFollow = settings.defaultNoFollow || Boolean(page?.noFollow);

  const maxImagePreview = page?.maxImagePreview ?? settings.maxImagePreview;
  const maxSnippet = page?.maxSnippet ?? settings.maxSnippet;
  const maxVideoPreview = page?.maxVideoPreview ?? settings.maxVideoPreview;

  const directives = {
    index: !noIndex,
    follow: !noFollow,
    noarchive: settings.defaultNoArchive || Boolean(page?.noArchive),
    nosnippet: settings.defaultNoSnippet || Boolean(page?.noSnippet),
    noimageindex: settings.defaultNoImageIndex || Boolean(page?.noImageIndex),
  };

  if (noIndex) {
    return { ...directives, googleBot: { index: false, follow: !noFollow } };
  }

  return {
    ...directives,
    googleBot: {
      index: true,
      follow: !noFollow,
      noimageindex: directives.noimageindex,
      "max-snippet": maxSnippet,
      "max-image-preview": SEO_IMAGE_PREVIEW_VALUE[maxImagePreview],
      "max-video-preview": maxVideoPreview,
    },
  };
}

function buildVerification(
  settings: SeoSettingsContent,
  integrations: SeoIntegrationItem[],
): Metadata["verification"] {
  const other: Record<string, string> = {};
  let google = settings.googleSiteVerification;

  for (const tag of integrationMetaTags(integrations)) {
    if (tag.name === "google-site-verification") {
      google = google || tag.content;
      continue;
    }
    other[tag.name] = tag.content;
  }

  if (settings.bingSiteVerification) other["msvalidate.01"] = settings.bingSiteVerification;
  if (settings.pinterestVerification) other["p:domain_verify"] = settings.pinterestVerification;
  if (settings.facebookDomainVerification) {
    other["facebook-domain-verification"] = settings.facebookDomainVerification;
  }
  if (settings.baiduVerification) other["baidu-site-verification"] = settings.baiduVerification;
  if (settings.nortonVerification) other["norton-safeweb-site-verification"] = settings.nortonVerification;
  for (const entry of settings.customVerifications) {
    other[entry.name] = entry.content;
  }

  return {
    google: google || undefined,
    yandex: settings.yandexVerification || undefined,
    yahoo: settings.yahooVerification || undefined,
    other: Object.keys(other).length ? other : undefined,
  };
}

function buildLanguages(
  settings: SeoSettingsContent,
  page: SeoPageContent | null,
): Record<string, string> | undefined {
  if (!settings.hreflangEnabled) return undefined;
  const entries = [...settings.hreflangEntries, ...(page?.hreflangEntries ?? [])];
  if (!entries.length) return undefined;
  return entries.reduce<Record<string, string>>((accumulator, entry) => {
    accumulator[entry.hreflang] = toAbsoluteUrl(settings, entry.href);
    return accumulator;
  }, {});
}

type IconDescriptor = { url: string; sizes?: string; type?: string };

function buildIconList(settings: SeoSettingsContent): IconDescriptor[] {
  const icons: IconDescriptor[] = [];
  if (settings.svgIconUrl) icons.push({ url: settings.svgIconUrl, type: "image/svg+xml" });
  if (settings.faviconUrl) icons.push({ url: settings.faviconUrl, sizes: "32x32", type: "image/png" });
  if (settings.faviconSmallUrl) {
    icons.push({ url: settings.faviconSmallUrl, sizes: "16x16", type: "image/png" });
  }
  return icons;
}

export type BuildMetadataInput = {
  path: string;
  entity?: SeoEntityOverride;
  fallbackTitle?: string;
  fallbackDescription?: string;
};

export async function buildMetadata({
  path,
  entity = {},
  fallbackTitle,
  fallbackDescription,
}: BuildMetadataInput): Promise<Metadata> {
  const [settings, page, integrations] = await Promise.all([
    getSeoSettings(),
    getSeoPage(path),
    getSeoIntegrations(),
  ]);
  return composeMetadata({
    settings,
    page,
    integrations,
    path,
    entity,
    fallbackTitle,
    fallbackDescription,
  });
}

export function composeMetadata({
  settings,
  page,
  integrations = [],
  path,
  entity = {},
  fallbackTitle,
  fallbackDescription,
}: {
  settings: SeoSettingsContent;
  page: SeoPageContent | null;
  integrations?: SeoIntegrationItem[];
  path: string;
  entity?: SeoEntityOverride;
  fallbackTitle?: string;
  fallbackDescription?: string;
}): Metadata {
  const normalized = normalizePath(path);
  const isHome = normalized === "/";
  const origin = resolveOrigin(settings);
  const url = toAbsoluteUrl(settings, canonicalPath(settings, normalized));

  const rawTitle = firstNonEmpty(
    entity.title,
    page?.title,
    fallbackTitle,
    isHome ? settings.defaultTitle : "",
    settings.defaultTitle,
  );
  const title = applyTemplate(settings, rawTitle, isHome);

  const description = firstNonEmpty(
    entity.description,
    page?.description,
    fallbackDescription,
    settings.defaultDescription,
  );

  const keywords = firstNonEmpty(
    entity.keywords,
    page?.keywords,
    [page?.focusKeyword, page?.secondaryKeywords].filter(Boolean).join(", "),
    settings.defaultKeywords,
  );

  const canonical = firstNonEmpty(entity.canonicalUrl, page?.canonicalUrl) || url;

  const ogImage = firstNonEmpty(
    entity.imageUrl,
    page?.ogImageUrl,
    settings.ogImageUrl,
  );
  const twitterImage = firstNonEmpty(
    entity.twitterImageUrl,
    page?.twitterImageUrl,
    settings.twitterImageUrl,
    ogImage,
  );
  const ogImageAlt = firstNonEmpty(entity.imageAlt, page?.ogImageAlt, settings.ogImageAlt, title);

  const twitterCard =
    SEO_TWITTER_CARD_VALUE[page?.twitterCard ?? settings.twitterCard] ?? "summary_large_image";

  const other: Record<string, string> = {};
  if (settings.copyrightText) other["copyright"] = settings.copyrightText;
  if (settings.organizationName) other["organization"] = settings.organizationName;
  if (settings.contactEmail) other["reply-to"] = settings.contactEmail;
  if (settings.addressLocality || settings.addressRegion) {
    other["geo.placename"] = [settings.addressLocality, settings.addressRegion]
      .filter(Boolean)
      .join(", ");
  }
  if (settings.addressCountry) other["geo.region"] = settings.addressCountry;
  if (settings.latitude && settings.longitude) {
    other["geo.position"] = `${settings.latitude};${settings.longitude}`;
    other["ICBM"] = `${settings.latitude}, ${settings.longitude}`;
  }
  if (settings.facebookAppId) other["fb:app_id"] = settings.facebookAppId;
  if (settings.facebookPageUrl) other["fb:pages"] = settings.facebookPageUrl;
  const summaryForAi = firstNonEmpty(entity.description, page?.aiSummary, settings.aiSummary);
  if (settings.aeoEnabled && summaryForAi) other["ai-summary"] = summaryForAi;

  const metadata: Metadata = {
    metadataBase: origin ? new URL(origin) : undefined,
    title,
    description,
    keywords: keywords || undefined,
    applicationName: settings.applicationName || undefined,
    generator: settings.generatorName || undefined,
    category: settings.categoryMeta || undefined,
    referrer: (settings.referrerPolicy || undefined) as Metadata["referrer"],
    authors: entity.authors?.length
      ? entity.authors.map((name) => ({ name }))
      : settings.authorName
        ? [{ name: settings.authorName, url: origin || undefined }]
        : undefined,
    creator: settings.authorName || undefined,
    publisher: settings.publisherName || undefined,
    formatDetection: { telephone: settings.formatDetectionTelephone },
    alternates: {
      canonical,
      languages: buildLanguages(settings, page),
      types: settings.rssEnabled
        ? { "application/rss+xml": toAbsoluteUrl(settings, "/feed.xml") }
        : undefined,
    },
    robots: buildRobots(settings, page, entity),
    verification: buildVerification(settings, integrations),
    openGraph: {
      type: (firstNonEmpty(entity.ogType, page?.ogType, settings.ogType) ||
        "website") as "website",
      title: firstNonEmpty(page?.ogTitle, title),
      description: firstNonEmpty(page?.ogDescription, description),
      url,
      siteName: settings.ogSiteName || settings.siteName,
      locale: settings.siteLocale,
      alternateLocale: settings.alternateLocales.length ? settings.alternateLocales : undefined,
      images: ogImage
        ? [
            {
              url: toAbsoluteUrl(settings, ogImage),
              width: settings.ogImageWidth,
              height: settings.ogImageHeight,
              alt: ogImageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterCard,
      title: firstNonEmpty(page?.twitterTitle, title),
      description: firstNonEmpty(page?.twitterDescription, description),
      site: settings.twitterSite || undefined,
      creator: settings.twitterCreator || undefined,
      images: twitterImage ? [toAbsoluteUrl(settings, twitterImage)] : undefined,
    },
    icons: {
      icon: buildIconList(settings),
      apple: settings.appleTouchIconUrl || undefined,
      other: settings.maskIconUrl
        ? [{ rel: "mask-icon", url: settings.maskIconUrl, color: settings.maskIconColor }]
        : undefined,
    },
    manifest: settings.manifestEnabled ? "/manifest.webmanifest" : undefined,
    other: Object.keys(other).length ? other : undefined,
  };

  if (entity.ogType === "article" && metadata.openGraph) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime: entity.publishedTime,
      modifiedTime: entity.modifiedTime,
      authors: entity.authors,
      section: entity.section,
      tags: entity.tags,
    } as Metadata["openGraph"];
  }

  return metadata;
}
