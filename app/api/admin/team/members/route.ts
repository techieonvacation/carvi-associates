import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultTeamMembers } from "@/lib/cms/defaults";
import { teamMembersPayloadSchema } from "@/lib/cms/schemas";
import { mapTeamMember } from "@/lib/cms/queries";

export async function GET() {
  const members = await prisma.teamMember.findMany({
    where: { deletedAt: null },
    orderBy: { displayOrder: "asc" },
  });

  if (!members.length) {
    return NextResponse.json({
      members: defaultTeamMembers.map((member, index) => ({
        id: `fallback-${index}`,
        ...member,
      })),
    });
  }

  return NextResponse.json({ members: members.map(mapTeamMember) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const parsed = teamMembersPayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const members = await prisma.$transaction(async (tx) => {
    const existing = await tx.teamMember.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });
    const keepIds = new Set(
      parsed.data.members.map((m) => m.id).filter((id): id is string => Boolean(id)),
    );
    const toTrash = existing.filter((row) => !keepIds.has(row.id)).map((row) => row.id);
    if (toTrash.length) {
      await tx.teamMember.updateMany({
        where: { id: { in: toTrash } },
        data: { deletedAt: new Date(), isVisible: false },
      });
    }

    const saved = [];
    for (const [index, member] of parsed.data.members.entries()) {
      const data = {
        name: member.name.trim(),
        role: member.role.trim(),
        imageUrl: member.imageUrl.trim(),
        imageAlt: member.imageAlt.trim() || member.name.trim(),
        href: member.href.trim() || "#",
        socials: member.socials,
        displayOrder: index,
        isVisible: member.isVisible,
        isActive: member.isActive,
        deletedAt: null,
      };

      if (member.id && !member.id.startsWith("fallback-") && !member.id.startsWith("new-")) {
        saved.push(await tx.teamMember.update({ where: { id: member.id }, data }));
      } else {
        saved.push(await tx.teamMember.create({ data }));
      }
    }

    return saved.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  return NextResponse.json({ members: members.map(mapTeamMember) });
}
