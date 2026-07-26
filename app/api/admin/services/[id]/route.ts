import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { serviceItemSchema } from "@/lib/cms/schemas";
import { mapServiceRow, serviceWriteData } from "@/lib/cms/service-mappers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
  return NextResponse.json({ service: mapServiceRow(service) });
}

export async function PUT(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = serviceItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const service = await prisma.service.update({
      where: { id },
      data: serviceWriteData(
        parsed.data,
        parsed.data.displayOrder ?? existing.displayOrder,
      ),
    });
    return NextResponse.json({ service: mapServiceRow(service) });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const hard = searchParams.get("hard") === "true";

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  if (hard) {
    if (!existing.deletedAt) {
      return NextResponse.json(
        { error: "Move to trash before permanent delete" },
        { status: 400 },
      );
    }
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  const service = await prisma.service.update({
    where: { id },
    data: { deletedAt: new Date(), isVisible: false },
  });

  return NextResponse.json({ service: mapServiceRow(service) });
}
