import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { mapProjectItem } from "@/lib/cms/queries";
import { projectsReorderSchema } from "@/lib/cms/schemas";

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = projectsReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.$transaction(
    parsed.data.orderedIds.map((id, index) =>
      prisma.projectItem.update({ where: { id }, data: { displayOrder: index } }),
    ),
  );

  const items = await prisma.projectItem.findMany({
    where: { deletedAt: null },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ items: items.map(mapProjectItem) });
}
