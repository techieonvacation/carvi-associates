import type {
  SeoFaqItem,
  SeoIntegrationItem,
  SeoPageContent,
  SeoRedirectItem,
  SeoSchemaItem,
  SeoSettingsContent,
} from "@/lib/seo/types";

export type AuditSeverity = "critical" | "warning" | "info" | "pass";

export type AuditCheck = {
  id: string;
  group: string;
  label: string;
  severity: AuditSeverity;
  detail: string;
  fixHref?: string;
};

export type AuditReport = {
  score: number;
  checks: AuditCheck[];
  counts: Record<AuditSeverity, number>;
};

type AuditInput = {
  settings: SeoSettingsContent;
  pages: SeoPageContent[];
  redirects: SeoRedirectItem[];
  integrations: SeoIntegrationItem[];
  faqs: SeoFaqItem[];
  schemas: SeoSchemaItem[];
  blogStats: { total: number; missingDescription: number; missingOgImage: number };
};

const TITLE_MIN = 30;
const TITLE_MAX = 65;
const DESCRIPTION_MIN = 70;
const DESCRIPTION_MAX = 165;

export function runSeoAudit(input: AuditInput): AuditReport {
  const { settings, pages, redirects, integrations, faqs, schemas, blogStats } = input;
  const checks: AuditCheck[] = [];

  const add = (check: AuditCheck) => checks.push(check);

  add({
    id: "indexing",
    group: "Indexing",
    label: "Search engine indexing",
    severity: settings.indexingEnabled && !settings.defaultNoIndex ? "pass" : "critical",
    detail: settings.indexingEnabled
      ? settings.defaultNoIndex
        ? "Default noindex is on — every page is hidden from search results."
        : "Site is open to search engines."
      : "Indexing is switched off globally. Nothing will be indexed.",
    fixHref: "/admin/seo",
  });

  const titleLength = settings.defaultTitle.trim().length;
  add({
    id: "default-title",
    group: "On-page",
    label: "Default title length",
    severity:
      titleLength === 0
        ? "critical"
        : titleLength < TITLE_MIN || titleLength > TITLE_MAX
          ? "warning"
          : "pass",
    detail: `${titleLength} characters (target ${TITLE_MIN}–${TITLE_MAX}).`,
    fixHref: "/admin/seo",
  });

  const descriptionLength = settings.defaultDescription.trim().length;
  add({
    id: "default-description",
    group: "On-page",
    label: "Default meta description length",
    severity:
      descriptionLength === 0
        ? "critical"
        : descriptionLength < DESCRIPTION_MIN || descriptionLength > DESCRIPTION_MAX
          ? "warning"
          : "pass",
    detail: `${descriptionLength} characters (target ${DESCRIPTION_MIN}–${DESCRIPTION_MAX}).`,
    fixHref: "/admin/seo",
  });

  add({
    id: "canonical-host",
    group: "Technical",
    label: "Canonical origin",
    severity: settings.siteUrl.startsWith("https://") ? "pass" : "critical",
    detail: settings.siteUrl
      ? `Canonical URLs resolve against ${settings.canonicalHost || settings.siteUrl}.`
      : "No site URL configured — canonical tags cannot be generated.",
    fixHref: "/admin/seo",
  });

  add({
    id: "og-image",
    group: "Social",
    label: "Default share image",
    severity: settings.ogImageUrl ? "pass" : "warning",
    detail: settings.ogImageUrl
      ? "Open Graph image is set for link previews."
      : "No default Open Graph image — social shares will render without artwork.",
    fixHref: "/admin/seo",
  });

  add({
    id: "twitter-card",
    group: "Social",
    label: "Twitter/X card",
    severity: settings.twitterSite || settings.twitterCreator ? "pass" : "info",
    detail:
      settings.twitterSite || settings.twitterCreator
        ? "Card attribution handles are configured."
        : "Add @handles so X attributes shared links to the firm.",
    fixHref: "/admin/seo",
  });

  const hasVerification =
    Boolean(settings.googleSiteVerification) ||
    integrations.some((item) => item.provider === "GOOGLE_SEARCH_CONSOLE" && item.isActive);
  add({
    id: "google-verification",
    group: "Off-page",
    label: "Google Search Console",
    severity: hasVerification ? "pass" : "warning",
    detail: hasVerification
      ? "Domain ownership token is present."
      : "Add the Search Console token to monitor impressions, clicks and coverage.",
    fixHref: "/admin/seo/scripts",
  });

  const hasBing =
    Boolean(settings.bingSiteVerification) ||
    integrations.some((item) => item.provider === "BING_WEBMASTER" && item.isActive);
  add({
    id: "bing-verification",
    group: "Off-page",
    label: "Bing Webmaster Tools",
    severity: hasBing ? "pass" : "info",
    detail: hasBing
      ? "Bing ownership token is present."
      : "Bing powers Copilot answers — verifying improves AI citation coverage.",
    fixHref: "/admin/seo/scripts",
  });

  const hasAnalytics = integrations.some(
    (item) =>
      item.isActive &&
      ["GOOGLE_ANALYTICS", "GOOGLE_TAG_MANAGER", "PLAUSIBLE", "FATHOM", "MATOMO", "POSTHOG"].includes(
        item.provider,
      ),
  );
  add({
    id: "analytics",
    group: "Measurement",
    label: "Analytics installed",
    severity: hasAnalytics ? "pass" : "warning",
    detail: hasAnalytics
      ? "At least one analytics provider is live."
      : "No analytics provider is active — traffic cannot be measured.",
    fixHref: "/admin/seo/scripts",
  });

  add({
    id: "sitemap",
    group: "Technical",
    label: "XML sitemap",
    severity: settings.sitemapEnabled ? "pass" : "critical",
    detail: settings.sitemapEnabled
      ? "Sitemap is generated at /sitemap.xml."
      : "Sitemap generation is disabled.",
    fixHref: "/admin/seo/technical",
  });

  add({
    id: "robots",
    group: "Technical",
    label: "robots.txt",
    severity: settings.robotsEnabled ? "pass" : "critical",
    detail: settings.robotsEnabled
      ? "robots.txt is served with the configured rules."
      : "robots.txt currently blocks all crawlers.",
    fixHref: "/admin/seo/technical",
  });

  add({
    id: "organization-schema",
    group: "Structured data",
    label: "Organization schema",
    severity: settings.organizationEnabled ? "pass" : "warning",
    detail: settings.organizationEnabled
      ? `Publishing ${settings.organizationType.toLowerCase().replace(/_/g, " ")} structured data.`
      : "Organization structured data is disabled — the knowledge panel has nothing to read.",
    fixHref: "/admin/seo",
  });

  const hasNap = Boolean(
    settings.streetAddress && settings.addressLocality && settings.contactPhone,
  );
  add({
    id: "local-nap",
    group: "Local SEO",
    label: "Name, address, phone",
    severity: hasNap ? "pass" : "warning",
    detail: hasNap
      ? "Complete NAP data is published for local search."
      : "Add street address, city and phone so local results and map packs can match the listing.",
    fixHref: "/admin/seo",
  });

  add({
    id: "geo-coordinates",
    group: "Local SEO",
    label: "Geo coordinates",
    severity: settings.latitude && settings.longitude ? "pass" : "info",
    detail:
      settings.latitude && settings.longitude
        ? "Latitude and longitude are published."
        : "Coordinates sharpen local relevance for map-based queries.",
    fixHref: "/admin/seo",
  });

  add({
    id: "same-as",
    group: "Off-page",
    label: "Social profile links",
    severity: settings.sameAs.length >= 3 ? "pass" : settings.sameAs.length ? "info" : "warning",
    detail: settings.sameAs.length
      ? `${settings.sameAs.length} profile${settings.sameAs.length === 1 ? "" : "s"} linked via sameAs.`
      : "No sameAs profiles — entity consolidation across the web is weaker without them.",
    fixHref: "/admin/seo",
  });

  add({
    id: "faq-coverage",
    group: "AEO",
    label: "Answer coverage",
    severity: faqs.length >= 5 ? "pass" : faqs.length ? "info" : "warning",
    detail: faqs.length
      ? `${faqs.length} question${faqs.length === 1 ? "" : "s"} published as FAQPage data.`
      : "No FAQ entries — assistants have no direct answers to quote.",
    fixHref: "/admin/seo/structured-data",
  });

  add({
    id: "llms-txt",
    group: "AEO",
    label: "llms.txt",
    severity: settings.llmsTxtEnabled ? "pass" : "info",
    detail: settings.llmsTxtEnabled
      ? "An llms.txt summary is served for AI crawlers."
      : "Publishing llms.txt gives language models a curated map of the site.",
    fixHref: "/admin/seo",
  });

  add({
    id: "speakable",
    group: "AEO",
    label: "Speakable markup",
    severity:
      settings.aeoEnabled && settings.speakableEnabled && settings.speakableSelectors.length
        ? "pass"
        : "info",
    detail: settings.speakableSelectors.length
      ? `${settings.speakableSelectors.length} speakable selector${settings.speakableSelectors.length === 1 ? "" : "s"} configured.`
      : "Add speakable selectors so voice assistants know which passage to read.",
    fixHref: "/admin/seo",
  });

  add({
    id: "ai-summary",
    group: "AEO",
    label: "Entity summary",
    severity: settings.aiSummary.trim().length > 80 ? "pass" : "warning",
    detail: settings.aiSummary.trim().length
      ? "A concise entity summary is available to answer engines."
      : "Write a one-paragraph description of the firm for AI answer engines.",
    fixHref: "/admin/seo",
  });

  const pagesMissingTitle = pages.filter((page) => !page.title?.trim()).length;
  add({
    id: "page-titles",
    group: "On-page",
    label: "Page title overrides",
    severity: pagesMissingTitle === 0 ? "pass" : "warning",
    detail:
      pagesMissingTitle === 0
        ? `All ${pages.length} managed route${pages.length === 1 ? "" : "s"} carry a title.`
        : `${pagesMissingTitle} managed route${pagesMissingTitle === 1 ? "" : "s"} fall back to the site default title.`,
    fixHref: "/admin/seo/pages",
  });

  const pagesMissingDescription = pages.filter((page) => !page.description?.trim()).length;
  add({
    id: "page-descriptions",
    group: "On-page",
    label: "Page description overrides",
    severity: pagesMissingDescription === 0 ? "pass" : "warning",
    detail:
      pagesMissingDescription === 0
        ? "Every managed route has its own meta description."
        : `${pagesMissingDescription} route${pagesMissingDescription === 1 ? "" : "s"} reuse the default description.`,
    fixHref: "/admin/seo/pages",
  });

  const duplicateTitles = new Set<string>();
  const seenTitles = new Set<string>();
  for (const page of pages) {
    const value = page.title?.trim().toLowerCase();
    if (!value) continue;
    if (seenTitles.has(value)) duplicateTitles.add(value);
    seenTitles.add(value);
  }
  add({
    id: "duplicate-titles",
    group: "On-page",
    label: "Duplicate titles",
    severity: duplicateTitles.size === 0 ? "pass" : "warning",
    detail:
      duplicateTitles.size === 0
        ? "No duplicate titles across managed routes."
        : `${duplicateTitles.size} title${duplicateTitles.size === 1 ? "" : "s"} are reused on more than one route.`,
    fixHref: "/admin/seo/pages",
  });

  add({
    id: "blog-descriptions",
    group: "Content",
    label: "Article meta descriptions",
    severity:
      blogStats.total === 0
        ? "info"
        : blogStats.missingDescription === 0
          ? "pass"
          : "warning",
    detail:
      blogStats.total === 0
        ? "No published articles yet."
        : blogStats.missingDescription === 0
          ? `All ${blogStats.total} published articles have a description.`
          : `${blogStats.missingDescription} of ${blogStats.total} published articles fall back to the excerpt.`,
    fixHref: "/admin/blog",
  });

  add({
    id: "blog-og",
    group: "Content",
    label: "Article share images",
    severity:
      blogStats.total === 0 ? "info" : blogStats.missingOgImage === 0 ? "pass" : "info",
    detail:
      blogStats.missingOgImage === 0
        ? "Every article ships a dedicated social image."
        : `${blogStats.missingOgImage} article${blogStats.missingOgImage === 1 ? "" : "s"} reuse the cover image for social previews.`,
    fixHref: "/admin/blog",
  });

  const redirectSources = new Set(redirects.map((item) => item.source));
  const loops = redirects.filter((item) => redirectSources.has(item.destination));
  add({
    id: "redirect-loops",
    group: "Technical",
    label: "Redirect chains",
    severity: loops.length === 0 ? "pass" : "critical",
    detail:
      loops.length === 0
        ? `${redirects.length} redirect${redirects.length === 1 ? "" : "s"} resolve in a single hop.`
        : `${loops.length} redirect${loops.length === 1 ? "" : "s"} point at another redirect source.`,
    fixHref: "/admin/seo/technical",
  });

  add({
    id: "custom-schema",
    group: "Structured data",
    label: "Custom JSON-LD blocks",
    severity: schemas.length ? "pass" : "info",
    detail: schemas.length
      ? `${schemas.length} custom schema block${schemas.length === 1 ? "" : "s"} are published.`
      : "Add Service, Person or Review schema blocks to enrich rich results.",
    fixHref: "/admin/seo/structured-data",
  });

  add({
    id: "rss",
    group: "Off-page",
    label: "RSS feed",
    severity: settings.rssEnabled ? "pass" : "info",
    detail: settings.rssEnabled
      ? "A feed is published at /feed.xml for syndication and aggregators."
      : "Enabling RSS helps aggregators and newsletters pick up new articles.",
    fixHref: "/admin/seo",
  });

  const counts: Record<AuditSeverity, number> = {
    critical: 0,
    warning: 0,
    info: 0,
    pass: 0,
  };
  for (const check of checks) counts[check.severity] += 1;

  const scoreable = checks.filter((check) => check.severity !== "info");
  const earned = scoreable.reduce((total, check) => {
    if (check.severity === "pass") return total + 1;
    if (check.severity === "warning") return total + 0.4;
    return total;
  }, 0);
  const score = scoreable.length ? Math.round((earned / scoreable.length) * 100) : 100;

  return { score, checks, counts };
}
