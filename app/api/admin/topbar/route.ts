import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

const topbarSchema = z.object({
  email: z.string().email(),
  address: z.string().min(1),
  addressMapUrl: z.string().url(),
  phone: z.string().min(1),
  phoneHref: z.string().min(1),
  whatsappLabel: z.string().min(1),
  whatsappHref: z.string().url(),
});

export async function GET() {
  const topbar = await prisma.topbarSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json({ topbar });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = topbarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const topbar = await prisma.topbarSettings.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: { id: "default", ...parsed.data },
  });

  return NextResponse.json({ topbar });
}
