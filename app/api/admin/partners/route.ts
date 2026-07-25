import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { partnersPayloadSchema } from "@/lib/cms/schemas";
import { defaultPartnerMarqueeLabel, defaultPartners } from "@/lib/cms/defaults";

export async function GET() {
  const [settings, partners] = await Promise.all([
    prisma.partnerMarqueeSettings.findUnique({ where: { id: "default" } }),
    prisma.partner.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return NextResponse.json({
    label: settings?.label ?? defaultPartnerMarqueeLabel,
    partners: partners.length
      ? partners
      : defaultPartners.map((partner, index) => ({
          id: `fallback-${index}`,
          ...partner,
        })),
  });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = partnersPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const settings = await tx.partnerMarqueeSettings.upsert({
      where: { id: "default" },
      update: { label: parsed.data.label },
      create: { id: "default", label: parsed.data.label },
    });

    await tx.partner.deleteMany();
    await tx.partner.createMany({
      data: parsed.data.partners.map((partner, index) => ({
        name: partner.name,
        tagline: partner.tagline || null,
        logoUrl: partner.logoUrl || null,
        variant: partner.variant,
        sortOrder: index,
        visible: partner.visible,
      })),
    });

    const partners = await tx.partner.findMany({ orderBy: { sortOrder: "asc" } });
    return { label: settings.label, partners };
  });

  return NextResponse.json(result);
}
