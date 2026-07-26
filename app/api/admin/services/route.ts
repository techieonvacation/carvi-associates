import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultServices } from "@/lib/cms/defaults";
import { serviceItemSchema } from "@/lib/cms/schemas";
import { mapServiceRow, serviceWriteData } from "@/lib/cms/service-mappers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trash = searchParams.get("trash") === "true";
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status");

  const where: Prisma.ServiceWhereInput = {
    deletedAt: trash ? { not: null } : null,
  };

  if (search) {
    where.OR = [
      { titleLine1: { contains: search, mode: "insensitive" } },
      { titleLine2: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status === "visible") where.isVisible = true;
  if (status === "hidden") where.isVisible = false;
  if (status === "active") where.isActive = true;
  if (status === "inactive") where.isActive = false;
  if (status === "featured") where.isFeatured = true;

  const services = await prisma.service.findMany({
    where,
    orderBy: trash ? { deletedAt: "desc" } : { displayOrder: "asc" },
  });

  if (!services.length && !trash && !search && !status) {
    return NextResponse.json({
      services: defaultServices.map((service, index) => ({
        id: `fallback-${index}`,
        ...service,
      })),
    });
  }

  return NextResponse.json({ services: services.map(mapServiceRow) });
}

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = serviceItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const maxOrder = await prisma.service.aggregate({
    where: { deletedAt: null },
    _max: { displayOrder: true },
  });
  const displayOrder =
    parsed.data.displayOrder ?? (maxOrder._max.displayOrder ?? -1) + 1;

  try {
    const service = await prisma.service.create({
      data: serviceWriteData(parsed.data, displayOrder),
    });
    return NextResponse.json({ service: mapServiceRow(service) }, { status: 201 });
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
