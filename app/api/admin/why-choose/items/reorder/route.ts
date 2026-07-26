import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { whyChooseReorderSchema } from "@/lib/cms/schemas";
import { mapWhyChooseItem } from "@/lib/cms/queries";

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = whyChooseReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const items = await prisma.$transaction(async (tx) => {
    await Promise.all(
      parsed.data.orderedIds.map((id, index) =>
        tx.whyChooseItem.updateMany({
          where: { id, deletedAt: null },
          data: { displayOrder: index },
        }),
      ),
    );

    return tx.whyChooseItem.findMany({
      where: { deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });
  });

  return NextResponse.json({ items: items.map(mapWhyChooseItem) });
}
