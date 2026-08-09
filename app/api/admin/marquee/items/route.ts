import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultMarqueeItems } from "@/lib/cms/defaults";
import { marqueeItemWriteData } from "@/lib/cms/marquee-mappers";
import { mapMarqueeItem } from "@/lib/cms/queries";
import { marqueeItemSchema, marqueeItemsPayloadSchema } from "@/lib/cms/schemas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trash = searchParams.get("trash") === "true";

  const items = await prisma.marqueeItem.findMany({
    where: { deletedAt: trash ? { not: null } : null },
    orderBy: trash ? { deletedAt: "desc" } : { displayOrder: "asc" },
  });

  if (!items.length && !trash) {
    return NextResponse.json({
      items: defaultMarqueeItems.map((item, index) => ({
        id: `fallback-${index}`,
        ...item,
      })),
    });
  }

  return NextResponse.json({ items: items.map(mapMarqueeItem) });
}

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = marqueeItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const maxOrder = await prisma.marqueeItem.aggregate({
    where: { deletedAt: null },
    _max: { displayOrder: true },
  });

  const item = await prisma.marqueeItem.create({
    data: marqueeItemWriteData(
      parsed.data,
      parsed.data.displayOrder ?? (maxOrder._max.displayOrder ?? -1) + 1,
    ),
  });

  return NextResponse.json({ item: mapMarqueeItem(item) }, { status: 201 });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = marqueeItemsPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const items = await prisma.$transaction(async (tx) => {
    const existing = await tx.marqueeItem.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });
    const keepIds = new Set(
      parsed.data.items
        .map((item) => item.id)
        .filter((id): id is string => typeof id === "string" && !id.startsWith("fallback-")),
    );
    const toTrash = existing.filter((row) => !keepIds.has(row.id)).map((row) => row.id);

    if (toTrash.length) {
      await tx.marqueeItem.updateMany({
        where: { id: { in: toTrash } },
        data: { deletedAt: new Date(), isVisible: false },
      });
    }

    const saved = [];
    for (const [index, item] of parsed.data.items.entries()) {
      const data = marqueeItemWriteData(item, index);
      const persisted =
        item.id && !item.id.startsWith("fallback-") && !item.id.startsWith("new-");

      saved.push(
        persisted
          ? await tx.marqueeItem.update({ where: { id: item.id }, data })
          : await tx.marqueeItem.create({ data }),
      );
    }

    return saved.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  return NextResponse.json({ items: items.map(mapMarqueeItem) });
}
