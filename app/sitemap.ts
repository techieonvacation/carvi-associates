import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getPublishedPostRefs } from "@/lib/cms/blog-queries";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, authors] = await Promise.all([
    getPublishedPostRefs(),
    prisma.blogCategory.findMany({
      where: { deletedAt: null, isVisible: true, isActive: true, noIndex: false },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogAuthor.findMany({
      where: { deletedAt: null, isVisible: true, isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/insight`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  return [
    ...staticRoutes,
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: `${SITE_URL}/blog/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...authors.map((author) => ({
      url: `${SITE_URL}/blog/author/${author.slug}`,
      lastModified: author.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
