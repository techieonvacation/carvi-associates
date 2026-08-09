import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultProjectItems } from "@/lib/cms/defaults";
import { claimProjectSlug, projectItemWriteData } from "@/lib/cms/projects-mappers";
import { mapProjectItem } from "@/lib/cms/queries";
import { projectItemSchema, projectItemsPayloadSchema } from "@/lib/cms/schemas";

async function takenSlugs(excludedIds: string[]) {
  const rows = await prisma.projectItem.findMany({
    where: { slug: { not: null }, id: { notIn: excludedIds } },
    select: { slug: true },
  });
  return new Set(rows.flatMap((row) => (row.slug ? [row.slug] : [])));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trash = searchParams.get("trash") === "true";

  const items = await prisma.projectItem.findMany({
    where: { deletedAt: trash ? { not: null } : null },
    orderBy: trash ? { deletedAt: "desc" } : { displayOrder: "asc" },
  });

  if (!items.length && !trash) {
    return NextResponse.json({
      items: defaultProjectItems.map((item, index) => ({
        id: `fallback-${index}`,
        ...item,
      })),
    });
  }

  return NextResponse.json({ items: items.map(mapProjectItem) });
}

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = projectItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const maxOrder = await prisma.projectItem.aggregate({
    where: { deletedAt: null },
    _max: { displayOrder: true },
  });
  const slug = claimProjectSlug(parsed.data, await takenSlugs([]));

  const item = await prisma.projectItem.create({
    data: projectItemWriteData(
      parsed.data,
      parsed.data.displayOrder ?? (maxOrder._max.displayOrder ?? -1) + 1,
      slug,
    ),
  });

  return NextResponse.json({ item: mapProjectItem(item) }, { status: 201 });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = projectItemsPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const keepIds = new Set(
    parsed.data.items
      .map((item) => item.id)
      .filter((id): id is string => typeof id === "string" && !id.startsWith("fallback-")),
  );
  const taken = await takenSlugs([...keepIds]);
  const slugs = parsed.data.items.map((item) => claimProjectSlug(item, taken));

  const items = await prisma.$transaction(async (tx) => {
    const existing = await tx.projectItem.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });
    const toTrash = existing.filter((row) => !keepIds.has(row.id)).map((row) => row.id);

    if (toTrash.length) {
      await tx.projectItem.updateMany({
        where: { id: { in: toTrash } },
        data: { deletedAt: new Date(), isVisible: false, slug: null },
      });
    }

    const saved = [];
    for (const [index, item] of parsed.data.items.entries()) {
      const data = projectItemWriteData(item, index, slugs[index]);
      const persisted =
        item.id && !item.id.startsWith("fallback-") && !item.id.startsWith("new-");

      saved.push(
        persisted
          ? await tx.projectItem.update({ where: { id: item.id }, data })
          : await tx.projectItem.create({ data }),
      );
    }

    return saved.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  return NextResponse.json({ items: items.map(mapProjectItem) });
}
