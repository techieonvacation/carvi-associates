import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultTopbar } from "@/lib/cms/defaults";

const optional = (schema: z.ZodType<string>) => z.union([z.literal(""), schema]);

const topbarSchema = z.object({
  email: optional(z.string().email()),
  address: z.string().max(200),
  addressMapUrl: optional(z.string().url()),
  phone: z.string().max(40),
  phoneHref: z.string().max(200),
  openHours: z.string().max(80),
  noteLabel: z.string().max(24),
  noteText: z.string().max(120),
  showNote: z.boolean(),
  socialsTitle: z.string().max(40),
  showSocials: z.boolean(),
  whatsappLabel: z.string().min(1).max(160),
  whatsappHref: optional(z.string().url()),
  whatsappIntroText: z.string().max(120),
  whatsappLinkText: z.string().max(120),
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

  const data = Object.fromEntries(
    Object.entries(parsed.data).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ]),
  ) as typeof parsed.data;

  const topbar = await prisma.topbarSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({ topbar });
}
