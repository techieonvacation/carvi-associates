import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

const navItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  href: z.string().min(1),
  sortOrder: z.number().int(),
  visible: z.boolean(),
});

const navPayloadSchema = z.object({
  items: z.array(navItemSchema),
});

export async function GET() {
  const items = await prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = navPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const items = await prisma.$transaction(async (tx) => {
    await tx.navItem.deleteMany();
    await tx.navItem.createMany({
      data: parsed.data.items.map((item) => ({
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
        visible: item.visible,
      })),
    });
    return tx.navItem.findMany({ orderBy: { sortOrder: "asc" } });
  });

  return NextResponse.json({ items });
}
