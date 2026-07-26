import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { mapServiceRow } from "@/lib/cms/service-mappers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing || !existing.deletedAt) {
    return NextResponse.json({ error: "Trashed service not found" }, { status: 404 });
  }

  const service = await prisma.service.update({
    where: { id },
    data: { deletedAt: null },
  });

  return NextResponse.json({ service: mapServiceRow(service) });
}
