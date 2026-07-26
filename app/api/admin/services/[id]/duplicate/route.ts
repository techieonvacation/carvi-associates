import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { mapServiceRow, slugify } from "@/lib/cms/service-mappers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const source = await prisma.service.findUnique({ where: { id } });
  if (!source || source.deletedAt) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const maxOrder = await prisma.service.aggregate({
    where: { deletedAt: null },
    _max: { displayOrder: true },
  });

  const service = await prisma.service.create({
    data: {
      titleLine1: source.titleLine1,
      titleLine2: source.titleLine2,
      shortTitle: source.shortTitle,
      subtitle: source.subtitle,
      description: source.description,
      slug: `${slugify(`${source.titleLine1} ${source.titleLine2}-copy`)}-${Date.now().toString(36)}`,
      icon: source.icon,
      iconType: source.iconType,
      imageUrl: source.imageUrl,
      imageAlt: source.imageAlt,
      hoverImageUrl: source.hoverImageUrl,
      badge: source.badge,
      category: source.category,
      serviceType: source.serviceType,
      accentColor: source.accentColor,
      ctaText: source.ctaText,
      ctaHref: source.ctaHref,
      displayOrder: (maxOrder._max.displayOrder ?? -1) + 1,
      isFeatured: source.isFeatured,
      isPopular: source.isPopular,
      isActive: false,
      isVisible: false,
      publishedAt: null,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      seoKeywords: source.seoKeywords,
      canonicalUrl: source.canonicalUrl,
      ogImageUrl: source.ogImageUrl,
      noIndex: source.noIndex,
    },
  });

  return NextResponse.json({ service: mapServiceRow(service) }, { status: 201 });
}
