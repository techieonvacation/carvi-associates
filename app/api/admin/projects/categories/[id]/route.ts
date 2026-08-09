import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { projectCategoryWriteData } from "@/lib/cms/projects-mappers";
import { mapProjectCategory } from "@/lib/cms/queries";
import { projectCategorySchema } from "@/lib/cms/schemas";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.projectCategory.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = projectCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const slug = parsed.data.slug.trim();
  const duplicate = await prisma.projectCategory.findFirst({
    where: { slug, id: { not: id } },
  });
  if (duplicate) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const category = await prisma.projectCategory.update({
    where: { id },
    data: projectCategoryWriteData(
      parsed.data,
      parsed.data.displayOrder ?? existing.displayOrder,
    ),
  });

  if (slug !== existing.slug) {
    await prisma.projectItem.updateMany({
      where: { categorySlug: existing.slug },
      data: { categorySlug: slug },
    });
  }

  return NextResponse.json({ category: mapProjectCategory(category) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.projectCategory.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.projectItem.updateMany({
      where: { categorySlug: existing.slug },
      data: { categorySlug: null },
    }),
    prisma.projectCategory.delete({ where: { id } }),
  ]);

  return NextResponse.json({ ok: true });
}
