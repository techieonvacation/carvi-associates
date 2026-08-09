import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { mapMarqueeItem } from "@/lib/cms/queries";
import { marqueeBulkSchema } from "@/lib/cms/schemas";

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = marqueeBulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { ids, action } = parsed.data;

  if (action === "hard-delete") {
    await prisma.marqueeItem.deleteMany({
      where: { id: { in: ids }, deletedAt: { not: null } },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "duplicate") {
    const sources = await prisma.marqueeItem.findMany({
      where: { id: { in: ids }, deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });
    const maxOrder = await prisma.marqueeItem.aggregate({
      where: { deletedAt: null },
      _max: { displayOrder: true },
    });
    let nextOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    const created = [];

    for (const source of sources) {
      const item = await prisma.marqueeItem.create({
        data: {
          kind: source.kind,
          band: source.band,
          text: source.text,
          imageUrl: source.imageUrl,
          imageAlt: source.imageAlt,
          imageWidth: source.imageWidth,
          imageHeight: source.imageHeight,
          href: source.href,
          outlined: source.outlined,
          displayOrder: nextOrder,
          isVisible: false,
          isActive: false,
        },
      });
      created.push(mapMarqueeItem(item));
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
            : action === "soft-delete"
              ? { deletedAt: new Date(), isVisible: false }
              : action === "restore"
                ? { deletedAt: null }
                : null;

  if (!data) {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  await prisma.marqueeItem.updateMany({ where: { id: { in: ids } }, data });

  const items = await prisma.marqueeItem.findMany({
    where: { id: { in: ids } },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ items: items.map(mapMarqueeItem) });
}
