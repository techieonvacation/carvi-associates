import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { whyChooseBulkSchema } from "@/lib/cms/schemas";
import { mapWhyChooseItem } from "@/lib/cms/queries";

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = whyChooseBulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { ids, action } = parsed.data;
  const now = new Date();

  if (action === "hard-delete") {
    await prisma.whyChooseItem.deleteMany({
      where: { id: { in: ids }, deletedAt: { not: null } },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "duplicate") {
    const sources = await prisma.whyChooseItem.findMany({
      where: { id: { in: ids }, deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });
    const maxOrder = await prisma.whyChooseItem.aggregate({
      where: { deletedAt: null },
      _max: { displayOrder: true },
    });
    let nextOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    const created = [];

    for (const source of sources) {
      const item = await prisma.whyChooseItem.create({
        data: {
          icon: source.icon,
          title: `${source.title} (Copy)`,
          text: source.text,
          href: source.href,
          displayOrder: nextOrder,
          isVisible: false,
          isActive: false,
        },
      });
      created.push(mapWhyChooseItem(item));
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
              ? { deletedAt: now, isVisible: false }
              : action === "restore"
                ? { deletedAt: null }
                : null;

  if (!data) {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  await prisma.whyChooseItem.updateMany({
    where: { id: { in: ids } },
    data,
  });

  const items = await prisma.whyChooseItem.findMany({
    where: { id: { in: ids } },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ items: items.map(mapWhyChooseItem) });
}
