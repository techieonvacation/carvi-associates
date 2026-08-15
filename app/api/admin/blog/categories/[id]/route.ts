import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { takenCategorySlugs } from "@/lib/cms/blog-admin";
import { blogCategoryWriteData, claimSlug, mapBlogCategory } from "@/lib/cms/blog-mappers";
import { blogCategorySchema } from "@/lib/cms/blog-schemas";

const withCount = { _count: { select: { posts: true } } } as const;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.blogCategory.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = blogCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const slug = claimSlug(
    parsed.data.slug || existing.slug,
    parsed.data.name,
    await takenCategorySlugs(id),
  );

  const category = await prisma.blogCategory.update({
    where: { id },
    data: blogCategoryWriteData(
      parsed.data,
      slug,
      parsed.data.displayOrder ?? existing.displayOrder,
    ),
    include: withCount,
  });

  return NextResponse.json({ category: mapBlogCategory(category) });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const hard = searchParams.get("hard") === "true";

  const existing = await prisma.blogCategory.findUnique({
    where: { id },
    include: { _count: { select: { posts: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  if (hard) {
    if (!existing.deletedAt) {
      return NextResponse.json(
        { error: "Move to trash before permanent delete" },
        { status: 400 },
      );
    }
    await prisma.blogCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  const category = await prisma.blogCategory.update({
    where: { id },
    data: { deletedAt: new Date(), isVisible: false },
    include: withCount,
  });

  return NextResponse.json({ category: mapBlogCategory(category) });
}
