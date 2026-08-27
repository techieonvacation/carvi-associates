import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbNode,
  buildFaqNode,
  buildGraph,
  buildOrganizationNode,
  buildWebPageNode,
  buildWebSiteNode,
  normalizeCustomJsonLd,
} from "@/lib/seo/json-ld";
import { canonicalPath, toAbsoluteUrl } from "@/lib/seo/metadata";
import {
  getSeoFaqsForPath,
  getSeoPage,
  getSeoSchemaBlocksForPath,
  getSeoSettings,
} from "@/lib/seo/queries";
import type { BreadcrumbEntry } from "@/lib/seo/types";

type PageJsonLdProps = {
  path: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  pageType?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: BreadcrumbEntry[];
  primaryEntityId?: string;
  extraNodes?: Array<Record<string, unknown> | null>;
  includeGlobalNodes?: boolean;
  includeFaqs?: boolean;
};

export async function PageJsonLd({
  path,
  title,
  description,
  imageUrl,
  pageType,
  datePublished,
  dateModified,
  breadcrumbs = [],
  primaryEntityId,
  extraNodes = [],
  includeGlobalNodes = true,
  includeFaqs = true,
}: PageJsonLdProps) {
  const [settings, page, faqs, schemaBlocks] = await Promise.all([
    getSeoSettings(),
    getSeoPage(path),
    includeFaqs ? getSeoFaqsForPath(path) : Promise.resolve([]),
    getSeoSchemaBlocksForPath(path),
  ]);

  const url = toAbsoluteUrl(settings, canonicalPath(settings, path));
  const resolvedTitle = title || page?.title || settings.defaultTitle;
  const resolvedDescription = description || page?.description || settings.defaultDescription;

  const breadcrumbNode = buildBreadcrumbNode(settings, breadcrumbs, url);

  const webPageNode = buildWebPageNode(settings, {
    url,
    title: resolvedTitle,
    description: resolvedDescription,
    imageUrl: imageUrl || page?.ogImageUrl || settings.ogImageUrl,
    pageType,
    keywords: page?.keywords ?? undefined,
    datePublished,
    dateModified,
    breadcrumbId: breadcrumbNode ? `${url}#breadcrumb` : undefined,
    speakableSelectors: page?.speakableSelectors,
    primaryEntityId,
  });

  const faqNode =
    settings.aeoEnabled && faqs.length ? buildFaqNode(settings, faqs, url) : null;

  const customNodes = schemaBlocks.flatMap((block) => {
    const normalized = normalizeCustomJsonLd(block.jsonLd);
    if (!normalized) return [];
    return Array.isArray(normalized) ? normalized : [normalized];
  });

  const pageCustom = normalizeCustomJsonLd(page?.customJsonLd);
  const pageCustomNodes = pageCustom
    ? Array.isArray(pageCustom)
      ? pageCustom
      : [pageCustom]
    : [];

  const graph = buildGraph([
    ...(includeGlobalNodes && settings.organizationEnabled
      ? [buildOrganizationNode(settings)]
      : []),
    ...(includeGlobalNodes && settings.websiteSchemaEnabled ? [buildWebSiteNode(settings)] : []),
    webPageNode,
    breadcrumbNode,
    ...extraNodes,
    faqNode,
    ...customNodes,
    ...pageCustomNodes,
  ]);

  if (!graph["@graph"].length) return null;

  return <JsonLd id={`seo-jsonld-${path === "/" ? "home" : path.replace(/\W+/g, "-")}`} data={graph} />;
}
