import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultBookAppointment } from "@/lib/cms/defaults";
import { bookAppointmentSchema } from "@/lib/cms/schemas";
import { normalizeNullable } from "@/lib/cms/service-mappers";

function toPayload(row: {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  backgroundImageUrl: string;
  backgroundImageAlt: string;
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
    description: row.description,
    primaryButtonText: row.primaryButtonText,
    primaryButtonHref: row.primaryButtonHref,
    secondaryButtonText: row.secondaryButtonText,
    secondaryButtonHref: row.secondaryButtonHref,
    backgroundImageUrl: row.backgroundImageUrl,
    backgroundImageAlt: row.backgroundImageAlt,
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
  const settings = await prisma.bookAppointmentSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    return NextResponse.json({
      bookAppointment: {
        tagline: defaultBookAppointment.tagline,
        titleLine1: defaultBookAppointment.title[0],
        titleLine2: defaultBookAppointment.title[1],
        description: defaultBookAppointment.description,
        primaryButtonText: defaultBookAppointment.primaryButtonText,
        primaryButtonHref: defaultBookAppointment.primaryButtonHref,
        secondaryButtonText: defaultBookAppointment.secondaryButtonText,
        secondaryButtonHref: defaultBookAppointment.secondaryButtonHref,
        backgroundImageUrl: defaultBookAppointment.backgroundImageUrl,
        backgroundImageAlt: defaultBookAppointment.backgroundImageAlt,
        taglineBg: defaultBookAppointment.taglineBg,
        isVisible: defaultBookAppointment.isVisible,
        seoTitle: defaultBookAppointment.seoTitle,
        seoDescription: defaultBookAppointment.seoDescription,
        seoKeywords: defaultBookAppointment.seoKeywords,
        canonicalUrl: defaultBookAppointment.canonicalUrl,
        ogImageUrl: defaultBookAppointment.ogImageUrl,
        twitterImageUrl: defaultBookAppointment.twitterImageUrl,
        noIndex: defaultBookAppointment.noIndex,
      },
    });
  }

  return NextResponse.json({ bookAppointment: toPayload(settings) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = bookAppointmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = {
    tagline: parsed.data.tagline.trim(),
    titleLine1: parsed.data.titleLine1.trim(),
    titleLine2: parsed.data.titleLine2.trim(),
    description: parsed.data.description.trim(),
    primaryButtonText: parsed.data.primaryButtonText.trim(),
    primaryButtonHref: parsed.data.primaryButtonHref.trim() || "#",
    secondaryButtonText: parsed.data.secondaryButtonText.trim(),
    secondaryButtonHref: parsed.data.secondaryButtonHref.trim() || "#",
    backgroundImageUrl: parsed.data.backgroundImageUrl.trim(),
    backgroundImageAlt: parsed.data.backgroundImageAlt.trim(),
    taglineBg: parsed.data.taglineBg.trim() || "#f4ebd8",
    isVisible: parsed.data.isVisible,
    seoTitle: normalizeNullable(parsed.data.seoTitle),
    seoDescription: normalizeNullable(parsed.data.seoDescription),
    seoKeywords: normalizeNullable(parsed.data.seoKeywords),
    canonicalUrl: normalizeNullable(parsed.data.canonicalUrl),
    ogImageUrl: normalizeNullable(parsed.data.ogImageUrl),
    twitterImageUrl: normalizeNullable(parsed.data.twitterImageUrl),
    noIndex: parsed.data.noIndex,
  };

  const settings = await prisma.bookAppointmentSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({ bookAppointment: toPayload(settings) });
}
