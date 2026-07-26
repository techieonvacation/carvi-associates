import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultWhyChooseItems } from "@/lib/cms/defaults";
import { whyChooseItemSchema, whyChooseItemsPayloadSchema } from "@/lib/cms/schemas";
import { mapWhyChooseItem } from "@/lib/cms/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trash = searchParams.get("trash") === "true";

  const items = await prisma.whyChooseItem.findMany({
    where: { deletedAt: trash ? { not: null } : null },
    orderBy: trash ? { deletedAt: "desc" } : { displayOrder: "asc" },
  });

  if (!items.length && !trash) {
    return NextResponse.json({
      items: defaultWhyChooseItems.map((item, index) => ({
        id: `fallback-${index}`,
        ...item,
      })),
    });
  }

  return NextResponse.json({ items: items.map(mapWhyChooseItem) });
}

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = whyChooseItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const maxOrder = await prisma.whyChooseItem.aggregate({
    where: { deletedAt: null },
    _max: { displayOrder: true },
  });

  const item = await prisma.whyChooseItem.create({
    data: {
      icon: parsed.data.icon.trim(),
      title: parsed.data.title.trim(),
      text: parsed.data.text.trim(),
      href: parsed.data.href.trim() || "#",
      displayOrder: parsed.data.displayOrder ?? (maxOrder._max.displayOrder ?? -1) + 1,
      isVisible: parsed.data.isVisible,
      isActive: parsed.data.isActive,
    },
  });

  return NextResponse.json({ item: mapWhyChooseItem(item) }, { status: 201 });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = whyChooseItemsPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const items = await prisma.$transaction(async (tx) => {
    const existing = await tx.whyChooseItem.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });
    const keepIds = new Set(
      parsed.data.items.map((item) => item.id).filter((id): id is string => Boolean(id)),
    );
    const toTrash = existing.filter((row) => !keepIds.has(row.id)).map((row) => row.id);

    if (toTrash.length) {
      await tx.whyChooseItem.updateMany({
        where: { id: { in: toTrash } },
        data: { deletedAt: new Date(), isVisible: false },
      });
    }

    const saved = [];
    for (const [index, item] of parsed.data.items.entries()) {
      const data = {
        icon: item.icon.trim(),
        title: item.title.trim(),
        text: item.text.trim(),
        href: item.href.trim() || "#",
        displayOrder: index,
        isVisible: item.isVisible,
        isActive: item.isActive,
        deletedAt: null,
      };

      if (item.id && !item.id.startsWith("fallback-")) {
        const updated = await tx.whyChooseItem.update({
          where: { id: item.id },
          data,
        });
        saved.push(updated);
      } else {
        const created = await tx.whyChooseItem.create({ data });
        saved.push(created);
      }
    }

    return saved.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  return NextResponse.json({ items: items.map(mapWhyChooseItem) });
}
