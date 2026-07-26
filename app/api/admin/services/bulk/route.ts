import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { servicesBulkSchema } from "@/lib/cms/schemas";
import { mapServiceRow, slugify } from "@/lib/cms/service-mappers";

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = servicesBulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { ids, action } = parsed.data;
  const now = new Date();

  if (action === "hard-delete") {
    await prisma.service.deleteMany({
      where: { id: { in: ids }, deletedAt: { not: null } },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "duplicate") {
    const sources = await prisma.service.findMany({
      where: { id: { in: ids }, deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });
    const maxOrder = await prisma.service.aggregate({
      where: { deletedAt: null },
      _max: { displayOrder: true },
    });
    let nextOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    const created = [];

    for (const source of sources) {
      const baseSlug = slugify(`${source.titleLine1} ${source.titleLine2}-copy`);
      const service = await prisma.service.create({
        data: {
          titleLine1: source.titleLine1,
          titleLine2: source.titleLine2,
          shortTitle: source.shortTitle,
          subtitle: source.subtitle,
          description: source.description,
          slug: `${baseSlug}-${Date.now().toString(36)}`,
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
          displayOrder: nextOrder,
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
      created.push(mapServiceRow(service));
      nextOrder += 1;
    }

    return NextResponse.json({ services: created });
  }

  const data =
    action === "publish"
      ? { isActive: true, isVisible: true, publishedAt: now, deletedAt: null }
      : action === "unpublish"
        ? { isActive: false }
        : action === "hide"
          ? { isVisible: false }
          : action === "show"
            ? { isVisible: true, deletedAt: null }
            : action === "activate"
              ? { isActive: true, deletedAt: null }
              : action === "deactivate"
                ? { isActive: false }
                : action === "soft-delete"
                  ? { deletedAt: now, isVisible: false }
                  : action === "restore"
                    ? { deletedAt: null }
                    : null;

  if (!data) {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  await prisma.service.updateMany({
    where: { id: { in: ids } },
    data,
  });

  const services = await prisma.service.findMany({
    where: { id: { in: ids } },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ services: services.map(mapServiceRow) });
}
