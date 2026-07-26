import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultWhyChoose } from "@/lib/cms/defaults";
import { whyChooseSectionSchema } from "@/lib/cms/schemas";
import { normalizeNullable } from "@/lib/cms/service-mappers";

function toPayload(row: {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  taglineBg: string;
  imageUrl: string;
  imageAlt: string;
  shapeImageUrl: string;
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
    taglineBg: row.taglineBg,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    shapeImageUrl: row.shapeImageUrl,
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
  const settings = await prisma.whyChooseSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    return NextResponse.json({
      whyChoose: {
        tagline: defaultWhyChoose.tagline,
        titleLine1: defaultWhyChoose.title[0],
        titleLine2: defaultWhyChoose.title[1],
        description: defaultWhyChoose.description,
        taglineBg: defaultWhyChoose.taglineBg,
        imageUrl: defaultWhyChoose.imageUrl,
        imageAlt: defaultWhyChoose.imageAlt,
        shapeImageUrl: defaultWhyChoose.shapeImageUrl,
        isVisible: defaultWhyChoose.isVisible,
        seoTitle: defaultWhyChoose.seoTitle,
        seoDescription: defaultWhyChoose.seoDescription,
        seoKeywords: defaultWhyChoose.seoKeywords,
        canonicalUrl: defaultWhyChoose.canonicalUrl,
        ogImageUrl: defaultWhyChoose.ogImageUrl,
        twitterImageUrl: defaultWhyChoose.twitterImageUrl,
        noIndex: defaultWhyChoose.noIndex,
      },
    });
  }

  return NextResponse.json({ whyChoose: toPayload(settings) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = whyChooseSectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = {
    tagline: parsed.data.tagline.trim(),
    titleLine1: parsed.data.titleLine1.trim(),
    titleLine2: parsed.data.titleLine2.trim(),
    description: parsed.data.description.trim(),
    taglineBg: parsed.data.taglineBg.trim() || "#f4ebd8",
    imageUrl: parsed.data.imageUrl.trim(),
    imageAlt: parsed.data.imageAlt.trim(),
    shapeImageUrl: parsed.data.shapeImageUrl.trim(),
    isVisible: parsed.data.isVisible,
    seoTitle: normalizeNullable(parsed.data.seoTitle),
    seoDescription: normalizeNullable(parsed.data.seoDescription),
    seoKeywords: normalizeNullable(parsed.data.seoKeywords),
    canonicalUrl: normalizeNullable(parsed.data.canonicalUrl),
    ogImageUrl: normalizeNullable(parsed.data.ogImageUrl),
    twitterImageUrl: normalizeNullable(parsed.data.twitterImageUrl),
    noIndex: parsed.data.noIndex,
  };

  const settings = await prisma.whyChooseSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({ whyChoose: toPayload(settings) });
}
