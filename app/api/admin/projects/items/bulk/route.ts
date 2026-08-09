import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { mapProjectItem } from "@/lib/cms/queries";
import { projectsBulkSchema } from "@/lib/cms/schemas";
import { slugify } from "@/lib/cms/service-mappers";

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = projectsBulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { ids, action } = parsed.data;

  if (action === "hard-delete") {
    await prisma.projectItem.deleteMany({
      where: { id: { in: ids }, deletedAt: { not: null } },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "duplicate") {
    const sources = await prisma.projectItem.findMany({
      where: { id: { in: ids }, deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });
    const maxOrder = await prisma.projectItem.aggregate({
      where: { deletedAt: null },
      _max: { displayOrder: true },
    });
    const claimed = await prisma.projectItem.findMany({
      where: { slug: { not: null } },
      select: { slug: true },
    });
    const taken = new Set(claimed.flatMap((row) => (row.slug ? [row.slug] : [])));
    let nextOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    const created = [];

    for (const source of sources) {
      const title = `${source.title} (Copy)`;
      const base = slugify(title);
      let slug = base || null;
      let counter = 2;
      while (slug && taken.has(slug)) {
        slug = `${base}-${counter}`;
        counter += 1;
      }
      if (slug) taken.add(slug);

      const item = await prisma.projectItem.create({
        data: {
          title,
          text: source.text,
          icon: source.icon,
          imageUrl: source.imageUrl,
          imageAlt: source.imageAlt,
          href: source.href,
          slug,
          categorySlug: source.categorySlug,
          tags: source.tags ?? [],
          displayOrder: nextOrder,
          isFeatured: false,
          isVisible: false,
          isActive: false,
        },
      });
      created.push(mapProjectItem(item));
      nextOrder += 1;
    }

    return NextResponse.json({ items: created });
  }

  const data =
    action === "show"
      ? { isVisible: true, deletedAt: null }
      : action === "hide"
        ? { isVisible: false }
        : action === "activate"
          ? { isActive: true, deletedAt: null }
          : action === "deactivate"
            ? { isActive: false }
            : action === "feature"
              ? { isFeatured: true }
              : action === "unfeature"
                ? { isFeatured: false }
                : action === "soft-delete"
                  ? { deletedAt: new Date(), isVisible: false, slug: null }
                  : action === "restore"
                    ? { deletedAt: null }
                    : null;

  if (!data) {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  await prisma.projectItem.updateMany({ where: { id: { in: ids } }, data });

  const items = await prisma.projectItem.findMany({
    where: { id: { in: ids } },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ items: items.map(mapProjectItem) });
}
