import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getPublishedPostRefs } from "@/lib/cms/blog-queries";
import { getSeoPages, getSeoSettings, getSeoSitemapEntries } from "@/lib/seo/queries";
import { canonicalPath, toAbsoluteUrl } from "@/lib/seo/metadata";
import { SEO_CHANGE_FREQUENCY_VALUE, type SeoSettingsContent } from "@/lib/seo/types";

export const dynamic = "force-dynamic";

type SitemapEntry = MetadataRoute.Sitemap[number];

function entry(
  settings: SeoSettingsContent,
  path: string,
  lastModified: Date | null,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"],
  images: string[] = [],
): SitemapEntry {
  return {
    url: toAbsoluteUrl(settings, canonicalPath(settings, path)),
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
    images:
      settings.sitemapIncludeImages && images.length
        ? images.map((image) => toAbsoluteUrl(settings, image))
        : undefined,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSeoSettings();
  if (!settings.sitemapEnabled || !settings.indexingEnabled) return [];

  const defaultFrequency = SEO_CHANGE_FREQUENCY_VALUE[settings.sitemapDefaultChangeFreq];

  const [pages, customEntries, posts, categories, tags, authors, services] = await Promise.all([
    getSeoPages(),
    getSeoSitemapEntries(),
    settings.sitemapIncludeBlog ? getPublishedPostRefs() : Promise.resolve([]),
    settings.sitemapIncludeCategories
      ? prisma.blogCategory.findMany({
          where: { deletedAt: null, isVisible: true, isActive: true, noIndex: false },
          select: { slug: true, updatedAt: true },
        })
      : Promise.resolve([]),
    settings.sitemapIncludeTags
      ? prisma.blogTag.findMany({
          where: { deletedAt: null, isVisible: true, isActive: true },
          select: { slug: true, updatedAt: true },
        })
      : Promise.resolve([]),
    settings.sitemapIncludeAuthors
      ? prisma.blogAuthor.findMany({
          where: { deletedAt: null, isVisible: true, isActive: true },
          select: { slug: true, updatedAt: true },
        })
      : Promise.resolve([]),
    settings.sitemapIncludeServices
      ? prisma.service.findMany({
          where: {
            deletedAt: null,
            isVisible: true,
            isActive: true,
            noIndex: false,
            slug: { not: null },
          },
          select: { slug: true, updatedAt: true, imageUrl: true, ctaHref: true },
        })
      : Promise.resolve([]),
  ]);

  const seen = new Set<string>();
  const output: MetadataRoute.Sitemap = [];

  const push = (value: SitemapEntry) => {
    if (seen.has(value.url)) return;
    if (output.length >= settings.sitemapMaxUrls) return;
    seen.add(value.url);
    output.push(value);
  };

  push(
    entry(settings, "/", new Date(), settings.sitemapHomePriority, defaultFrequency, [
      settings.ogImageUrl,
    ].filter(Boolean)),
  );

  if (settings.sitemapIncludePages) {
    for (const page of pages) {
      if (!page.includeInSitemap || page.noIndex) continue;
      push(
        entry(
          settings,
          page.path,
          page.sitemapLastMod ? new Date(page.sitemapLastMod) : page.updatedAt ? new Date(page.updatedAt) : null,
          page.sitemapPriority ?? settings.sitemapPagePriority,
          page.sitemapChangeFreq
            ? SEO_CHANGE_FREQUENCY_VALUE[page.sitemapChangeFreq]
            : defaultFrequency,
          [page.ogImageUrl ?? ""].filter(Boolean),
        ),
      );
    }
  }

  if (settings.sitemapIncludeBlog) {
    push(entry(settings, "/blog", new Date(), settings.sitemapBlogPriority, "daily"));
    for (const post of posts) {
      push(
        entry(
          settings,
          `/blog/${post.slug}`,
          post.updatedAt ?? post.publishedAt ?? null,
          settings.sitemapPostPriority,
          "monthly",
        ),
      );
    }
  }

  for (const category of categories) {
    push(
      entry(settings, `/blog/category/${category.slug}`, category.updatedAt, 0.6, "weekly"),
    );
  }

  for (const tag of tags) {
    push(entry(settings, `/blog/tag/${tag.slug}`, tag.updatedAt, 0.3, "weekly"));
  }

  for (const author of authors) {
    push(entry(settings, `/blog/author/${author.slug}`, author.updatedAt, 0.4, "monthly"));
  }

  for (const service of services) {
    const href = service.ctaHref?.trim() ?? "";
    if (!href.startsWith("/") || href.includes("#")) continue;
    push(
      entry(
        settings,
        href,
        service.updatedAt,
        settings.sitemapServicePriority,
        "monthly",
        [service.imageUrl].filter(Boolean),
      ),
    );
  }

  for (const custom of customEntries) {
    push({
      url: toAbsoluteUrl(settings, custom.url),
      lastModified: custom.lastModified ? new Date(custom.lastModified) : new Date(),
      changeFrequency: SEO_CHANGE_FREQUENCY_VALUE[custom.changeFrequency],
      priority: custom.priority,
      images:
        settings.sitemapIncludeImages && custom.imageUrls.length
          ? custom.imageUrls.map((image) => toAbsoluteUrl(settings, image))
          : undefined,
    });
  }

  return output;
}
