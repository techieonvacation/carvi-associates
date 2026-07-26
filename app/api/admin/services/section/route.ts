import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultServicesSection } from "@/lib/cms/defaults";
import { servicesSectionSchema } from "@/lib/cms/schemas";
import { normalizeNullable } from "@/lib/cms/service-mappers";

function toPayload(row: {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  cardTagline: string;
  taglineBg: string;
  isVisible: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  twitterImageUrl: string | null;
  noIndex: boolean;
}) {
  return {
    tagline: row.tagline,
    titleLine1: row.titleLine1,
    titleLine2: row.titleLine2,
    cardTagline: row.cardTagline,
    taglineBg: row.taglineBg,
    isVisible: row.isVisible,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    seoKeywords: row.seoKeywords,
    canonicalUrl: row.canonicalUrl,
    ogImageUrl: row.ogImageUrl,
    twitterImageUrl: row.twitterImageUrl,
    noIndex: row.noIndex,
  };
}

export async function GET() {
  const section = await prisma.servicesSectionSettings.findUnique({
    where: { id: "default" },
  });

  if (!section) {
    return NextResponse.json({
      section: {
        tagline: defaultServicesSection.tagline,
        titleLine1: defaultServicesSection.title[0],
        titleLine2: defaultServicesSection.title[1],
        cardTagline: defaultServicesSection.cardTagline,
        taglineBg: defaultServicesSection.taglineBg,
        isVisible: defaultServicesSection.isVisible,
        seoTitle: defaultServicesSection.seoTitle,
        seoDescription: defaultServicesSection.seoDescription,
        seoKeywords: defaultServicesSection.seoKeywords,
        canonicalUrl: defaultServicesSection.canonicalUrl,
        ogImageUrl: defaultServicesSection.ogImageUrl,
        twitterImageUrl: defaultServicesSection.twitterImageUrl,
        noIndex: defaultServicesSection.noIndex,
      },
    });
  }

  return NextResponse.json({ section: toPayload(section) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = servicesSectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = {
    tagline: parsed.data.tagline.trim(),
    titleLine1: parsed.data.titleLine1.trim(),
    titleLine2: parsed.data.titleLine2.trim(),
    cardTagline: parsed.data.cardTagline.trim(),
    taglineBg: parsed.data.taglineBg.trim() || "#fffdf8",
    isVisible: parsed.data.isVisible,
    seoTitle: normalizeNullable(parsed.data.seoTitle),
    seoDescription: normalizeNullable(parsed.data.seoDescription),
    seoKeywords: normalizeNullable(parsed.data.seoKeywords),
    canonicalUrl: normalizeNullable(parsed.data.canonicalUrl),
    ogImageUrl: normalizeNullable(parsed.data.ogImageUrl),
    twitterImageUrl: normalizeNullable(parsed.data.twitterImageUrl),
    noIndex: parsed.data.noIndex,
  };

  const section = await prisma.servicesSectionSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({ section: toPayload(section) });
}
