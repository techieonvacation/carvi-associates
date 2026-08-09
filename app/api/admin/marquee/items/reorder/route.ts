import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { mapMarqueeItem } from "@/lib/cms/queries";
import { marqueeReorderSchema } from "@/lib/cms/schemas";

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = marqueeReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.$transaction(
    parsed.data.orderedIds.map((id, index) =>
      prisma.marqueeItem.update({ where: { id }, data: { displayOrder: index } }),
    ),
  );

  const items = await prisma.marqueeItem.findMany({
    where: { deletedAt: null },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ items: items.map(mapMarqueeItem) });
}
