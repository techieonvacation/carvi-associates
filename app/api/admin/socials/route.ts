import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

const socialSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  icon: z.string().min(1),
  sortOrder: z.number().int(),
  visible: z.boolean(),
});

const socialPayloadSchema = z.object({
  items: z.array(socialSchema),
});

export async function GET() {
  const items = await prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = socialPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const items = await prisma.$transaction(async (tx) => {
    await tx.socialLink.deleteMany();
    await tx.socialLink.createMany({
      data: parsed.data.items,
    });
    return tx.socialLink.findMany({ orderBy: { sortOrder: "asc" } });
  });

  return NextResponse.json({ items });
}
