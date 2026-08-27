import { prisma } from "@/lib/prisma";
import { buildLlmsTxt } from "@/lib/seo/llms";
import { getSeoFaqs, getSeoPages, getSeoSettings } from "@/lib/seo/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSeoSettings();

  if (!settings.llmsTxtEnabled) {
    return new Response("Not found", { status: 404 });
  }

  const [pages, faqs, services, posts] = await Promise.all([
    getSeoPages(),
    getSeoFaqs(),
    prisma.service
      .findMany({
        where: { deletedAt: null, isVisible: true, isActive: true },
        orderBy: { displayOrder: "asc" },
        take: 30,
        select: {
          titleLine1: true,
          titleLine2: true,
          shortTitle: true,
          description: true,
          ctaHref: true,
        },
      })
      .catch(() => []),
    prisma.blogPost
      .findMany({
        where: {
          deletedAt: null,
          isVisible: true,
          isActive: true,
          noIndex: false,
          status: "PUBLISHED",
        },
        orderBy: { publishedAt: "desc" },
        take: 25,
        select: { title: true, excerpt: true, slug: true, publishedAt: true },
      })
      .catch(() => []),
  ]);

  const body = buildLlmsTxt(settings, {
    services: services.map((service) => ({
      title:
        service.shortTitle?.trim() ||
        `${service.titleLine1} ${service.titleLine2}`.trim(),
      description: service.description,
      url: service.ctaHref?.startsWith("/") ? service.ctaHref : "/#services",
    })),
    posts: posts.map((post) => ({
      title: post.title,
      excerpt: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    })),
    pages,
    faqs,
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
