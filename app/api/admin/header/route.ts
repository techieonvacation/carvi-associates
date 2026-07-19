import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

const headerSchema = z.object({
  contactCtaText: z.string().min(1),
  contactCtaHref: z.string().min(1),
});

export async function GET() {
  const header = await prisma.headerSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json({ header });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = headerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const header = await prisma.headerSettings.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: { id: "default", ...parsed.data },
  });

  return NextResponse.json({ header });
}
