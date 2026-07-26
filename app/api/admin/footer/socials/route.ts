import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultFooterSocials } from "@/lib/cms/defaults";
import { footerSocialsPayloadSchema } from "@/lib/cms/schemas";
import { mapFooterSocial } from "@/lib/cms/queries";

export async function GET() {
  const socials = await prisma.footerSocialLink.findMany({
    where: { deletedAt: null },
    orderBy: { displayOrder: "asc" },
  });

  if (!socials.length) {
    return NextResponse.json({
      socials: defaultFooterSocials.map((social, index) => ({
        id: `fallback-${index}`,
        ...social,
      })),
    });
  }

  return NextResponse.json({ socials: socials.map(mapFooterSocial) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const parsed = footerSocialsPayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const socials = await prisma.$transaction(async (tx) => {
    const existing = await tx.footerSocialLink.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });
    const keepIds = new Set(
      parsed.data.socials
        .map((social) => social.id)
        .filter((id): id is string => Boolean(id)),
    );
    const toTrash = existing.filter((row) => !keepIds.has(row.id)).map((row) => row.id);
    if (toTrash.length) {
      await tx.footerSocialLink.updateMany({
        where: { id: { in: toTrash } },
        data: { deletedAt: new Date(), isVisible: false },
      });
    }

    const saved = [];
    for (const [index, social] of parsed.data.socials.entries()) {
      const data = {
        label: social.label.trim(),
        href: social.href.trim(),
        icon: social.icon.trim(),
        displayOrder: index,
        isVisible: social.isVisible,
        isActive: social.isActive,
        deletedAt: null,
      };

      if (
        social.id &&
        !social.id.startsWith("fallback-") &&
        !social.id.startsWith("new-")
      ) {
        saved.push(await tx.footerSocialLink.update({ where: { id: social.id }, data }));
      } else {
        saved.push(await tx.footerSocialLink.create({ data }));
      }
    }

    return saved.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  return NextResponse.json({ socials: socials.map(mapFooterSocial) });
}
