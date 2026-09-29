import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultBlogSection } from "@/lib/cms/blog-defaults";
import { blogSectionSchema } from "@/lib/cms/blog-schemas";
import { normalizeNullable } from "@/lib/cms/service-mappers";

function toPayload(row: {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  taglineBg: string;
  homeLimit: number;
  homeCtaText: string;
  homeCtaHref: string;
  showHomeCta: boolean;
  isVisible: boolean;
  archiveTagline: string;
  archiveTitleLine1: string;
  archiveTitleLine2: string;
  archiveIntro: string;
  archiveHeroImage: string;
  archiveHeroOverlay: number;
  archiveHeroHeight: string;
  archiveHeroAlign: string;
  archiveShowCrumbs: boolean;
  postsPerPage: number;
  showSidebar: boolean;
  showSearch: boolean;
  showCategories: boolean;
  showTags: boolean;
  allowComments: boolean;
  moderateComments: boolean;
  disclaimer: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  twitterImageUrl: string | null;
  noIndex: boolean;
}) {
  return { ...row };
}

export async function GET() {
  const section = await prisma.blogSectionSettings.findUnique({ where: { id: "default" } });

  if (!section) {
    return NextResponse.json({
      section: {
        tagline: defaultBlogSection.tagline,
        titleLine1: defaultBlogSection.title[0],
        titleLine2: defaultBlogSection.title[1],
        taglineBg: defaultBlogSection.taglineBg,
        homeLimit: defaultBlogSection.homeLimit,
        homeCtaText: defaultBlogSection.homeCtaText,
        homeCtaHref: defaultBlogSection.homeCtaHref,
        showHomeCta: defaultBlogSection.showHomeCta,
        isVisible: defaultBlogSection.isVisible,
        archiveTagline: defaultBlogSection.archiveTagline,
        archiveTitleLine1: defaultBlogSection.archiveTitle[0],
        archiveTitleLine2: defaultBlogSection.archiveTitle[1],
        archiveIntro: defaultBlogSection.archiveIntro,
        archiveHeroImage: defaultBlogSection.archiveHeroImage,
        archiveHeroOverlay: defaultBlogSection.archiveHeroOverlay,
        archiveHeroHeight: defaultBlogSection.archiveHeroHeight,
        archiveHeroAlign: defaultBlogSection.archiveHeroAlign,
        archiveShowCrumbs: defaultBlogSection.archiveShowCrumbs,
        postsPerPage: defaultBlogSection.postsPerPage,
        showSidebar: defaultBlogSection.showSidebar,
        showSearch: defaultBlogSection.showSearch,
        showCategories: defaultBlogSection.showCategories,
        showTags: defaultBlogSection.showTags,
        allowComments: defaultBlogSection.allowComments,
        moderateComments: defaultBlogSection.moderateComments,
        disclaimer: defaultBlogSection.disclaimer,
        seoTitle: defaultBlogSection.seoTitle,
        seoDescription: defaultBlogSection.seoDescription,
        seoKeywords: defaultBlogSection.seoKeywords,
        canonicalUrl: defaultBlogSection.canonicalUrl,
        ogImageUrl: defaultBlogSection.ogImageUrl,
        twitterImageUrl: defaultBlogSection.twitterImageUrl,
        noIndex: defaultBlogSection.noIndex,
      },
    });
  }

  return NextResponse.json({ section: toPayload(section) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = blogSectionSchema.safeParse(body);
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
    taglineBg: parsed.data.taglineBg.trim() || "#f4ebd8",
    homeLimit: parsed.data.homeLimit,
    homeCtaText: parsed.data.homeCtaText.trim(),
    homeCtaHref: parsed.data.homeCtaHref.trim() || "/blog",
    showHomeCta: parsed.data.showHomeCta,
    isVisible: parsed.data.isVisible,
    archiveTagline: parsed.data.archiveTagline.trim(),
    archiveTitleLine1: parsed.data.archiveTitleLine1.trim(),
    archiveTitleLine2: parsed.data.archiveTitleLine2.trim(),
    archiveIntro: parsed.data.archiveIntro.trim(),
    archiveHeroImage: parsed.data.archiveHeroImage.trim(),
    archiveHeroOverlay: parsed.data.archiveHeroOverlay,
    archiveHeroHeight: parsed.data.archiveHeroHeight,
    archiveHeroAlign: parsed.data.archiveHeroAlign,
    archiveShowCrumbs: parsed.data.archiveShowCrumbs,
    postsPerPage: parsed.data.postsPerPage,
    showSidebar: parsed.data.showSidebar,
    showSearch: parsed.data.showSearch,
    showCategories: parsed.data.showCategories,
    showTags: parsed.data.showTags,
    allowComments: parsed.data.allowComments,
    moderateComments: parsed.data.moderateComments,
    disclaimer: parsed.data.disclaimer.trim(),
    seoTitle: normalizeNullable(parsed.data.seoTitle),
    seoDescription: normalizeNullable(parsed.data.seoDescription),
    seoKeywords: normalizeNullable(parsed.data.seoKeywords),
    canonicalUrl: normalizeNullable(parsed.data.canonicalUrl),
    ogImageUrl: normalizeNullable(parsed.data.ogImageUrl),
    twitterImageUrl: normalizeNullable(parsed.data.twitterImageUrl),
    noIndex: parsed.data.noIndex,
  };

  const section = await prisma.blogSectionSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({ section: toPayload(section) });
}
