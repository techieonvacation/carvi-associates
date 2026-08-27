import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { buildRobotsTxt } from "@/lib/seo/robots";
import { buildLlmsTxt } from "@/lib/seo/llms";
import { mapSeoFaq, mapSeoPage, mapSeoRobotsRule, mapSeoSettings } from "@/lib/seo/mappers";

export async function GET(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") ?? "robots";

  const settingsRow = await prisma.seoSettings.findUnique({ where: { id: "default" } });
  const settings = mapSeoSettings(settingsRow as Record<string, unknown> | null);

  if (kind === "llms") {
    const [pageRows, faqRows, services, posts] = await Promise.all([
      prisma.seoPage.findMany({
        where: { deletedAt: null, isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.seoFaq.findMany({
        where: { deletedAt: null, isActive: true, isVisible: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.service.findMany({
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
      }),
      prisma.blogPost.findMany({
        where: { deletedAt: null, status: "PUBLISHED", isVisible: true, isActive: true },
        orderBy: { publishedAt: "desc" },
        take: 25,
        select: { title: true, excerpt: true, slug: true, publishedAt: true },
      }),
    ]);

    const body = buildLlmsTxt(settings, {
      services: services.map((service) => ({
        title: service.shortTitle?.trim() || `${service.titleLine1} ${service.titleLine2}`.trim(),
        description: service.description,
        url: service.ctaHref?.startsWith("/") ? service.ctaHref : "/#services",
      })),
      posts: posts.map((post) => ({
        title: post.title,
        excerpt: post.excerpt,
        url: `/blog/${post.slug}`,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      })),
      pages: pageRows.map((row) => mapSeoPage(row as unknown as Record<string, unknown>)),
      faqs: faqRows.map((row) => mapSeoFaq(row as unknown as Record<string, unknown>)),
    });

    return NextResponse.json({ content: body });
  }

  const ruleRows = await prisma.seoRobotsRule.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  const content = buildRobotsTxt(
    settings,
    ruleRows.map((row) => mapSeoRobotsRule(row as unknown as Record<string, unknown>)),
  );

  return NextResponse.json({ content });
}
