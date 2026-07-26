import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { whyChooseItemSchema } from "@/lib/cms/schemas";
import { mapWhyChooseItem } from "@/lib/cms/queries";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.whyChooseItem.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = whyChooseItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const item = await prisma.whyChooseItem.update({
    where: { id },
    data: {
      icon: parsed.data.icon.trim(),
      title: parsed.data.title.trim(),
      text: parsed.data.text.trim(),
      href: parsed.data.href.trim() || "#",
      displayOrder: parsed.data.displayOrder ?? existing.displayOrder,
      isVisible: parsed.data.isVisible,
      isActive: parsed.data.isActive,
    },
  });

  return NextResponse.json({ item: mapWhyChooseItem(item) });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const hard = searchParams.get("hard") === "true";

  const existing = await prisma.whyChooseItem.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (hard) {
    if (!existing.deletedAt) {
      return NextResponse.json(
        { error: "Move to trash before permanent delete" },
        { status: 400 },
      );
    }
    await prisma.whyChooseItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  const item = await prisma.whyChooseItem.update({
    where: { id },
    data: { deletedAt: new Date(), isVisible: false },
  });

  return NextResponse.json({ item: mapWhyChooseItem(item) });
}
