import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultFooter } from "@/lib/cms/defaults";
import { footerSectionSchema } from "@/lib/cms/schemas";
import { normalizeNullable } from "@/lib/cms/service-mappers";

function toPayload(row: {
  about: string;
  backgroundImageUrl: string;
  watermarkText: string;
  showWatermark: boolean;
  copyrightText: string;
  linksTitle: string;
  exploreTitle: string;
  blogTitle: string;
  showAbout: boolean;
  showSocials: boolean;
  showLinks: boolean;
  showExplore: boolean;
  showRecentBlog: boolean;
  showBottomBar: boolean;
  useSiteSocials: boolean;
  logoTone: string;
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
    about: row.about,
    backgroundImageUrl: row.backgroundImageUrl,
    watermarkText: row.watermarkText,
    showWatermark: row.showWatermark,
    copyrightText: row.copyrightText,
    linksTitle: row.linksTitle,
    exploreTitle: row.exploreTitle,
    blogTitle: row.blogTitle,
    showAbout: row.showAbout,
    showSocials: row.showSocials,
    showLinks: row.showLinks,
    showExplore: row.showExplore,
    showRecentBlog: row.showRecentBlog,
    showBottomBar: row.showBottomBar,
    useSiteSocials: row.useSiteSocials,
    logoTone: row.logoTone === "light" ? "light" : "dark",
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
  const settings = await prisma.footerSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    return NextResponse.json({
      footer: {
        about: defaultFooter.about,
        backgroundImageUrl: defaultFooter.backgroundImageUrl,
        watermarkText: defaultFooter.watermarkText,
        showWatermark: defaultFooter.showWatermark,
        copyrightText: defaultFooter.copyrightText,
        linksTitle: defaultFooter.linksTitle,
        exploreTitle: defaultFooter.exploreTitle,
        blogTitle: defaultFooter.blogTitle,
        showAbout: defaultFooter.showAbout,
        showSocials: defaultFooter.showSocials,
        showLinks: defaultFooter.showLinks,
        showExplore: defaultFooter.showExplore,
        showRecentBlog: defaultFooter.showRecentBlog,
        showBottomBar: defaultFooter.showBottomBar,
        useSiteSocials: defaultFooter.useSiteSocials,
        logoTone: defaultFooter.logoTone,
        isVisible: defaultFooter.isVisible,
        seoTitle: defaultFooter.seoTitle,
        seoDescription: defaultFooter.seoDescription,
        seoKeywords: defaultFooter.seoKeywords,
        canonicalUrl: defaultFooter.canonicalUrl,
        ogImageUrl: defaultFooter.ogImageUrl,
        twitterImageUrl: defaultFooter.twitterImageUrl,
        noIndex: defaultFooter.noIndex,
      },
    });
  }

  return NextResponse.json({ footer: toPayload(settings) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const parsed = footerSectionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = {
    about: parsed.data.about.trim(),
    backgroundImageUrl: parsed.data.backgroundImageUrl.trim(),
    watermarkText: parsed.data.watermarkText.trim(),
    showWatermark: parsed.data.showWatermark,
    copyrightText: parsed.data.copyrightText.trim(),
    linksTitle: parsed.data.linksTitle.trim(),
    exploreTitle: parsed.data.exploreTitle.trim(),
    blogTitle: parsed.data.blogTitle.trim(),
    showAbout: parsed.data.showAbout,
    showSocials: parsed.data.showSocials,
    showLinks: parsed.data.showLinks,
    showExplore: parsed.data.showExplore,
    showRecentBlog: parsed.data.showRecentBlog,
    showBottomBar: parsed.data.showBottomBar,
    useSiteSocials: parsed.data.useSiteSocials,
    logoTone: parsed.data.logoTone,
    isVisible: parsed.data.isVisible,
    seoTitle: normalizeNullable(parsed.data.seoTitle),
    seoDescription: normalizeNullable(parsed.data.seoDescription),
    seoKeywords: normalizeNullable(parsed.data.seoKeywords),
    canonicalUrl: normalizeNullable(parsed.data.canonicalUrl),
    ogImageUrl: normalizeNullable(parsed.data.ogImageUrl),
    twitterImageUrl: normalizeNullable(parsed.data.twitterImageUrl),
    noIndex: parsed.data.noIndex,
  };

  const settings = await prisma.footerSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({ footer: toPayload(settings) });
}
