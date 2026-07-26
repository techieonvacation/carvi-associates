import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { servicesReorderSchema } from "@/lib/cms/schemas";
import { mapServiceRow } from "@/lib/cms/service-mappers";

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = servicesReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const services = await prisma.$transaction(async (tx) => {
    await Promise.all(
      parsed.data.orderedIds.map((id, index) =>
        tx.service.updateMany({
          where: { id, deletedAt: null },
          data: { displayOrder: index },
        }),
      ),
    );

    return tx.service.findMany({
      where: { deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });
  });

  return NextResponse.json({ services: services.map(mapServiceRow) });
}
