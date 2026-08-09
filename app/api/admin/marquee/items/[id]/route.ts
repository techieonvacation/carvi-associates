import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { marqueeItemWriteData } from "@/lib/cms/marquee-mappers";
import { mapMarqueeItem } from "@/lib/cms/queries";
import { marqueeItemSchema } from "@/lib/cms/schemas";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.marqueeItem.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = marqueeItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const item = await prisma.marqueeItem.update({
    where: { id },
    data: marqueeItemWriteData(
      parsed.data,
      parsed.data.displayOrder ?? existing.displayOrder,
    ),
  });

  return NextResponse.json({ item: mapMarqueeItem(item) });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const hard = searchParams.get("hard") === "true";

  const existing = await prisma.marqueeItem.findUnique({ where: { id } });
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
    await prisma.marqueeItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  const item = await prisma.marqueeItem.update({
    where: { id },
    data: { deletedAt: new Date(), isVisible: false },
  });

  return NextResponse.json({ item: mapMarqueeItem(item) });
}
