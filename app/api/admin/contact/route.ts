import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultContact } from "@/lib/cms/defaults";
import { contactSectionSchema } from "@/lib/cms/schemas";
import { normalizeNullable } from "@/lib/cms/service-mappers";

function toPayload(row: {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  taglineBg: string;
  phoneTitle: string;
  emailTitle: string;
  locationTitle: string;
  submitLabel: string;
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
    taglineBg: row.taglineBg,
    phoneTitle: row.phoneTitle,
    emailTitle: row.emailTitle,
    locationTitle: row.locationTitle,
    submitLabel: row.submitLabel,
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
  const settings = await prisma.contactSettings.findUnique({ where: { id: "default" } });

  if (!settings) {
    return NextResponse.json({
      contact: {
        tagline: defaultContact.tagline,
        titleLine1: defaultContact.title[0],
        titleLine2: defaultContact.title[1],
        taglineBg: defaultContact.taglineBg,
        phoneTitle: defaultContact.phoneTitle,
        emailTitle: defaultContact.emailTitle,
        locationTitle: defaultContact.locationTitle,
        submitLabel: defaultContact.submitLabel,
        isVisible: defaultContact.isVisible,
        seoTitle: defaultContact.seoTitle,
        seoDescription: defaultContact.seoDescription,
        seoKeywords: defaultContact.seoKeywords,
        canonicalUrl: defaultContact.canonicalUrl,
        ogImageUrl: defaultContact.ogImageUrl,
        twitterImageUrl: defaultContact.twitterImageUrl,
        noIndex: defaultContact.noIndex,
      },
    });
  }

  return NextResponse.json({ contact: toPayload(settings) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const parsed = contactSectionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const data = {
    tagline: parsed.data.tagline.trim(),
    titleLine1: parsed.data.titleLine1.trim(),
    titleLine2: parsed.data.titleLine2.trim(),
    taglineBg: parsed.data.taglineBg.trim() || defaultContact.taglineBg,
    phoneTitle: parsed.data.phoneTitle.trim(),
    emailTitle: parsed.data.emailTitle.trim(),
    locationTitle: parsed.data.locationTitle.trim(),
    submitLabel: parsed.data.submitLabel.trim(),
    isVisible: parsed.data.isVisible,
    seoTitle: normalizeNullable(parsed.data.seoTitle),
    seoDescription: normalizeNullable(parsed.data.seoDescription),
    seoKeywords: normalizeNullable(parsed.data.seoKeywords),
    canonicalUrl: normalizeNullable(parsed.data.canonicalUrl),
    ogImageUrl: normalizeNullable(parsed.data.ogImageUrl),
    twitterImageUrl: normalizeNullable(parsed.data.twitterImageUrl),
    noIndex: parsed.data.noIndex,
  };

  const settings = await prisma.contactSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({ contact: toPayload(settings) });
}
