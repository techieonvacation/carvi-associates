import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultTopbar } from "@/lib/cms/defaults";

const topbarSchema = z.object({
  email: z.string().email(),
  address: z.string().min(1),
  addressMapUrl: z.string().url(),
  phone: z.string().min(1),
  phoneHref: z.string().min(1),
  whatsappLabel: z.string().min(1),
  whatsappHref: z.string().url(),
  whatsappIntroText: z.string().min(1).max(120),
  whatsappLinkText: z.string().min(1).max(120),
  showWhatsappNotice: z.boolean(),
});

export async function GET() {
  const topbar = await prisma.topbarSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json({ topbar: topbar ?? defaultTopbar });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = topbarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const topbar = await prisma.topbarSettings.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: { id: "default", ...parsed.data },
  });

  return NextResponse.json({ topbar });
}
