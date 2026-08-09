import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultProjectCategories } from "@/lib/cms/defaults";
import { projectCategoryWriteData } from "@/lib/cms/projects-mappers";
import { mapProjectCategory } from "@/lib/cms/queries";
import {
  projectCategoriesPayloadSchema,
  projectCategorySchema,
} from "@/lib/cms/schemas";

export async function GET() {
  const categories = await prisma.projectCategory.findMany({
    where: { deletedAt: null },
    orderBy: { displayOrder: "asc" },
  });

  if (!categories.length) {
    return NextResponse.json({
      categories: defaultProjectCategories.map((category, index) => ({
        id: `fallback-${index}`,
        ...category,
      })),
    });
  }

  return NextResponse.json({ categories: categories.map(mapProjectCategory) });
}

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = projectCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const duplicate = await prisma.projectCategory.findUnique({
    where: { slug: parsed.data.slug.trim() },
  });
  if (duplicate) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const maxOrder = await prisma.projectCategory.aggregate({
    where: { deletedAt: null },
    _max: { displayOrder: true },
  });

  const category = await prisma.projectCategory.create({
    data: projectCategoryWriteData(
      parsed.data,
      parsed.data.displayOrder ?? (maxOrder._max.displayOrder ?? -1) + 1,
    ),
  });

  return NextResponse.json({ category: mapProjectCategory(category) }, { status: 201 });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = projectCategoriesPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const slugs = parsed.data.categories.map((category) => category.slug.trim());
  if (new Set(slugs).size !== slugs.length) {
    return NextResponse.json({ error: "Category slugs must be unique" }, { status: 400 });
  }

  const categories = await prisma.$transaction(async (tx) => {
    const existing = await tx.projectCategory.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });
    const keepIds = new Set(
      parsed.data.categories
        .map((category) => category.id)
        .filter((id): id is string => typeof id === "string" && !id.startsWith("fallback-")),
    );
    const toDelete = existing.filter((row) => !keepIds.has(row.id)).map((row) => row.id);

    if (toDelete.length) {
      await tx.projectCategory.deleteMany({ where: { id: { in: toDelete } } });
    }

    const saved = [];
    for (const [index, category] of parsed.data.categories.entries()) {
      const data = projectCategoryWriteData(category, index);
      const persisted =
        category.id &&
        !category.id.startsWith("fallback-") &&
        !category.id.startsWith("new-");

      saved.push(
        persisted
          ? await tx.projectCategory.update({ where: { id: category.id }, data })
          : await tx.projectCategory.create({ data }),
      );
    }

    return saved.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  return NextResponse.json({ categories: categories.map(mapProjectCategory) });
}
