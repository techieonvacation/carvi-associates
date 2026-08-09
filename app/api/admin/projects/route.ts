import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultProjectsSection } from "@/lib/cms/defaults";
import { projectsSectionSchema } from "@/lib/cms/schemas";
import { normalizeNullable } from "@/lib/cms/service-mappers";

type ProjectsSectionRow = {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  taglineBg: string;
  topBackgroundImageUrl: string;
  bottomBackgroundImageUrl: string;
  showFilters: boolean;
  allFilterLabel: string;
  showBottomBanner: boolean;
  bannerStat: string;
  bannerTitleLine1: string;
  bannerTitleLine2: string;
  bannerChecklist: unknown;
  bannerButtonText: string;
  bannerButtonHref: string;
  isVisible: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  twitterImageUrl: string | null;
  noIndex: boolean;
};

function toPayload(row: ProjectsSectionRow) {
  return {
    tagline: row.tagline,
    titleLine1: row.titleLine1,
    titleLine2: row.titleLine2,
    taglineBg: row.taglineBg,
    topBackgroundImageUrl: row.topBackgroundImageUrl,
    bottomBackgroundImageUrl: row.bottomBackgroundImageUrl,
    showFilters: row.showFilters,
    allFilterLabel: row.allFilterLabel,
    showBottomBanner: row.showBottomBanner,
    bannerStat: row.bannerStat,
    bannerTitleLine1: row.bannerTitleLine1,
    bannerTitleLine2: row.bannerTitleLine2,
    bannerChecklist: Array.isArray(row.bannerChecklist)
      ? row.bannerChecklist.filter((line): line is string => typeof line === "string")
      : [],
    bannerButtonText: row.bannerButtonText,
    bannerButtonHref: row.bannerButtonHref,
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
  const settings = await prisma.projectsSectionSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    const fallback: ProjectsSectionRow = {
      tagline: defaultProjectsSection.tagline,
      titleLine1: defaultProjectsSection.title[0],
      titleLine2: defaultProjectsSection.title[1],
      taglineBg: defaultProjectsSection.taglineBg,
      topBackgroundImageUrl: defaultProjectsSection.topBackgroundImageUrl,
      bottomBackgroundImageUrl: defaultProjectsSection.bottomBackgroundImageUrl,
      showFilters: defaultProjectsSection.showFilters,
      allFilterLabel: defaultProjectsSection.allFilterLabel,
      showBottomBanner: defaultProjectsSection.showBottomBanner,
      bannerStat: defaultProjectsSection.bannerStat,
      bannerTitleLine1: defaultProjectsSection.bannerTitle[0],
      bannerTitleLine2: defaultProjectsSection.bannerTitle[1],
      bannerChecklist: defaultProjectsSection.bannerChecklist,
      bannerButtonText: defaultProjectsSection.bannerButtonText,
      bannerButtonHref: defaultProjectsSection.bannerButtonHref,
      isVisible: defaultProjectsSection.isVisible,
      seoTitle: defaultProjectsSection.seoTitle,
      seoDescription: defaultProjectsSection.seoDescription,
      seoKeywords: defaultProjectsSection.seoKeywords,
      canonicalUrl: defaultProjectsSection.canonicalUrl,
      ogImageUrl: defaultProjectsSection.ogImageUrl,
      twitterImageUrl: defaultProjectsSection.twitterImageUrl,
      noIndex: defaultProjectsSection.noIndex,
    };
    return NextResponse.json({ projects: toPayload(fallback) });
  }

  return NextResponse.json({ projects: toPayload(settings) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = projectsSectionSchema.safeParse(body);
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
    taglineBg: parsed.data.taglineBg.trim() || defaultProjectsSection.taglineBg,
    topBackgroundImageUrl: parsed.data.topBackgroundImageUrl.trim(),
    bottomBackgroundImageUrl: parsed.data.bottomBackgroundImageUrl.trim(),
    showFilters: parsed.data.showFilters,
    allFilterLabel: parsed.data.allFilterLabel.trim(),
    showBottomBanner: parsed.data.showBottomBanner,
    bannerStat: parsed.data.bannerStat.trim(),
    bannerTitleLine1: parsed.data.bannerTitleLine1.trim(),
    bannerTitleLine2: parsed.data.bannerTitleLine2.trim(),
    bannerChecklist: parsed.data.bannerChecklist.map((line) => line.trim()),
    bannerButtonText: parsed.data.bannerButtonText.trim(),
    bannerButtonHref: parsed.data.bannerButtonHref.trim() || "#",
    isVisible: parsed.data.isVisible,
    seoTitle: normalizeNullable(parsed.data.seoTitle),
    seoDescription: normalizeNullable(parsed.data.seoDescription),
    seoKeywords: normalizeNullable(parsed.data.seoKeywords),
    canonicalUrl: normalizeNullable(parsed.data.canonicalUrl),
    ogImageUrl: normalizeNullable(parsed.data.ogImageUrl),
    twitterImageUrl: normalizeNullable(parsed.data.twitterImageUrl),
    noIndex: parsed.data.noIndex,
  };

  const settings = await prisma.projectsSectionSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({ projects: toPayload(settings) });
}
