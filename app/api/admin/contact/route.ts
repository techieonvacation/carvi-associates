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
  phoneText: string;
  phoneHref: string;
  showPhone: boolean;
  emailTitle: string;
  emailText: string;
  showEmail: boolean;
  locationTitle: string;
  locationText: string;
  locationUrl: string;
  showLocation: boolean;
  nameLabel: string;
  companyLabel: string;
  emailLabel: string;
  mobileLabel: string;
  locationLabel: string;
  messageLabel: string;
  submitLabel: string;
  sideImageUrl: string;
  sideImageAlt: string;
  showSideImage: boolean;
  showShape: boolean;
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
    phoneText: row.phoneText,
    phoneHref: row.phoneHref,
    showPhone: row.showPhone,
    emailTitle: row.emailTitle,
    emailText: row.emailText,
    showEmail: row.showEmail,
    locationTitle: row.locationTitle,
    locationText: row.locationText,
    locationUrl: row.locationUrl,
    showLocation: row.showLocation,
    nameLabel: row.nameLabel,
    companyLabel: row.companyLabel,
    emailLabel: row.emailLabel,
    mobileLabel: row.mobileLabel,
    locationLabel: row.locationLabel,
    messageLabel: row.messageLabel,
    submitLabel: row.submitLabel,
    sideImageUrl: row.sideImageUrl,
    sideImageAlt: row.sideImageAlt,
    showSideImage: row.showSideImage,
    showShape: row.showShape,
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
        phoneText: defaultContact.phoneText,
        phoneHref: defaultContact.phoneHref,
        showPhone: defaultContact.showPhone,
        emailTitle: defaultContact.emailTitle,
        emailText: defaultContact.emailText,
        showEmail: defaultContact.showEmail,
        locationTitle: defaultContact.locationTitle,
        locationText: defaultContact.locationText,
        locationUrl: defaultContact.locationUrl,
        showLocation: defaultContact.showLocation,
        nameLabel: defaultContact.nameLabel,
        companyLabel: defaultContact.companyLabel,
        emailLabel: defaultContact.emailLabel,
        mobileLabel: defaultContact.mobileLabel,
        locationLabel: defaultContact.locationLabel,
        messageLabel: defaultContact.messageLabel,
        submitLabel: defaultContact.submitLabel,
        sideImageUrl: defaultContact.sideImageUrl,
        sideImageAlt: defaultContact.sideImageAlt,
        showSideImage: defaultContact.showSideImage,
        showShape: defaultContact.showShape,
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
    phoneText: parsed.data.phoneText.trim(),
    phoneHref: parsed.data.phoneHref.trim(),
    showPhone: parsed.data.showPhone,
    emailTitle: parsed.data.emailTitle.trim(),
    emailText: parsed.data.emailText.trim(),
    showEmail: parsed.data.showEmail,
    locationTitle: parsed.data.locationTitle.trim(),
    locationText: parsed.data.locationText.trim(),
    locationUrl: parsed.data.locationUrl.trim(),
    showLocation: parsed.data.showLocation,
    nameLabel: parsed.data.nameLabel.trim(),
    companyLabel: parsed.data.companyLabel.trim(),
    emailLabel: parsed.data.emailLabel.trim(),
    mobileLabel: parsed.data.mobileLabel.trim(),
    locationLabel: parsed.data.locationLabel.trim(),
    messageLabel: parsed.data.messageLabel.trim(),
    submitLabel: parsed.data.submitLabel.trim(),
    sideImageUrl: parsed.data.sideImageUrl.trim(),
    sideImageAlt: parsed.data.sideImageAlt.trim(),
    showSideImage: parsed.data.showSideImage,
    showShape: parsed.data.showShape,
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
