import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { claimProjectSlug, projectItemWriteData } from "@/lib/cms/projects-mappers";
import { mapProjectItem } from "@/lib/cms/queries";
import { projectItemSchema } from "@/lib/cms/schemas";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.projectItem.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    return NextResponse.json({ error: "Case study not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = projectItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const conflicts = await prisma.projectItem.findMany({
    where: { slug: { not: null }, id: { not: id } },
    select: { slug: true },
  });
  const slug = claimProjectSlug(
    parsed.data,
    new Set(conflicts.flatMap((row) => (row.slug ? [row.slug] : []))),
  );

  const item = await prisma.projectItem.update({
    where: { id },
    data: projectItemWriteData(
      parsed.data,
      parsed.data.displayOrder ?? existing.displayOrder,
      slug,
    ),
  });

  return NextResponse.json({ item: mapProjectItem(item) });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const hard = searchParams.get("hard") === "true";

  const existing = await prisma.projectItem.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Case study not found" }, { status: 404 });
  }

  if (hard) {
    if (!existing.deletedAt) {
      return NextResponse.json(
        { error: "Move to trash before permanent delete" },
        { status: 400 },
      );
    }
    await prisma.projectItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  const item = await prisma.projectItem.update({
    where: { id },
    data: { deletedAt: new Date(), isVisible: false, slug: null },
  });

  return NextResponse.json({ item: mapProjectItem(item) });
}
