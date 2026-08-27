import { prisma } from "@/lib/prisma";
import { getSeoSettings } from "@/lib/seo/queries";
import { resolveOrigin, toAbsoluteUrl } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const settings = await getSeoSettings();

  if (!settings.rssEnabled) {
    return new Response("Not found", { status: 404 });
  }

  const origin = resolveOrigin(settings);

  const posts = await prisma.blogPost
    .findMany({
      where: {
        deletedAt: null,
        isVisible: true,
        isActive: true,
        noIndex: false,
        status: "PUBLISHED",
      },
      orderBy: { publishedAt: "desc" },
      take: settings.rssItemLimit,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        updatedAt: true,
        coverImageUrl: true,
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    })
    .catch(() => []);

  const items = posts
    .map((post) => {
      const url = `${origin}/blog/${post.slug}`;
      const published = (post.publishedAt ?? post.updatedAt ?? new Date()).toUTCString();
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        `      <pubDate>${published}</pubDate>`,
        post.category ? `      <category>${escapeXml(post.category.name)}</category>` : "",
        post.author ? `      <dc:creator>${escapeXml(post.author.name)}</dc:creator>` : "",
        post.coverImageUrl
          ? `      <enclosure url="${escapeXml(toAbsoluteUrl(settings, post.coverImageUrl))}" type="image/jpeg" />`
          : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${escapeXml(settings.rssTitle || settings.siteName)}</title>`,
    `    <link>${escapeXml(origin)}</link>`,
    `    <description>${escapeXml(settings.rssDescription || settings.defaultDescription)}</description>`,
    `    <language>${escapeXml(settings.siteLocale.replace("_", "-").toLowerCase())}</language>`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    settings.copyrightText ? `    <copyright>${escapeXml(settings.copyrightText)}</copyright>` : "",
    `    <atom:link href="${escapeXml(`${origin}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=86400",
    },
  });
}
