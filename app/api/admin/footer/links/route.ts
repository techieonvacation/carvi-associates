import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultFooterLinks } from "@/lib/cms/defaults";
import { footerLinksPayloadSchema } from "@/lib/cms/schemas";
import { mapFooterLink } from "@/lib/cms/queries";

export async function GET() {
  const links = await prisma.footerLink.findMany({
    where: { deletedAt: null },
    orderBy: [{ column: "asc" }, { displayOrder: "asc" }],
  });

  if (!links.length) {
    return NextResponse.json({ links: defaultFooterLinks });
  }

  return NextResponse.json({ links: links.map(mapFooterLink) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const parsed = footerLinksPayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const links = await prisma.$transaction(async (tx) => {
    const existing = await tx.footerLink.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });
    const keepIds = new Set(
      parsed.data.links.map((link) => link.id).filter((id): id is string => Boolean(id)),
    );
    const toTrash = existing.filter((row) => !keepIds.has(row.id)).map((row) => row.id);
    if (toTrash.length) {
      await tx.footerLink.updateMany({
        where: { id: { in: toTrash } },
        data: { deletedAt: new Date(), isVisible: false },
      });
    }

    const columnCounters: Record<string, number> = {
      LINKS_ONE: 0,
      LINKS_TWO: 0,
      EXPLORE: 0,
      BOTTOM: 0,
    };

    const saved = [];
    for (const link of parsed.data.links) {
      const order = columnCounters[link.column] ?? 0;
      columnCounters[link.column] = order + 1;
      const data = {
        label: link.label.trim(),
        href: link.href.trim() || "#",
        column: link.column,
        displayOrder: order,
        isVisible: link.isVisible,
        isActive: link.isActive,
        deletedAt: null,
      };

      if (link.id && !link.id.startsWith("fallback-") && !link.id.startsWith("new-")) {
        saved.push(await tx.footerLink.update({ where: { id: link.id }, data }));
      } else {
        saved.push(await tx.footerLink.create({ data }));
      }
    }

    return saved.sort((a, b) =>
      a.column === b.column
        ? a.displayOrder - b.displayOrder
        : a.column.localeCompare(b.column),
    );
  });

  return NextResponse.json({ links: links.map(mapFooterLink) });
}
