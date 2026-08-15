import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { takenCategorySlugs } from "@/lib/cms/blog-admin";
import { blogCategoryWriteData, claimSlug, mapBlogCategory } from "@/lib/cms/blog-mappers";
import { blogCategorySchema } from "@/lib/cms/blog-schemas";

const withCount = { _count: { select: { posts: true } } } as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trash = searchParams.get("trash") === "true";

  const categories = await prisma.blogCategory.findMany({
    where: { deletedAt: trash ? { not: null } : null },
    orderBy: trash ? { deletedAt: "desc" } : [{ displayOrder: "asc" }, { name: "asc" }],
    include: withCount,
  });

  return NextResponse.json({ categories: categories.map(mapBlogCategory) });
}

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = blogCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const maxOrder = await prisma.blogCategory.aggregate({
    where: { deletedAt: null },
    _max: { displayOrder: true },
  });
  const slug = claimSlug(parsed.data.slug, parsed.data.name, await takenCategorySlugs());

  const category = await prisma.blogCategory.create({
    data: blogCategoryWriteData(
      parsed.data,
      slug,
      parsed.data.displayOrder ?? (maxOrder._max.displayOrder ?? -1) + 1,
    ),
    include: withCount,
  });

  return NextResponse.json({ category: mapBlogCategory(category) }, { status: 201 });
}
