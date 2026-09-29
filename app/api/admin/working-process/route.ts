import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultWorkingProcess } from "@/lib/cms/defaults";
import { workingProcessSectionSchema } from "@/lib/cms/schemas";
import { normalizeNullable } from "@/lib/cms/service-mappers";

function toPayload(row: {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
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
  const settings = await prisma.workingProcessSettings.findUnique({
    where: { id: "default" },
  });
  if (!settings) {
    return NextResponse.json({
      workingProcess: {
        tagline: defaultWorkingProcess.tagline,
        titleLine1: defaultWorkingProcess.title[0],
        titleLine2: defaultWorkingProcess.title[1],
        taglineBg: defaultWorkingProcess.taglineBg,
        isVisible: defaultWorkingProcess.isVisible,
        seoTitle: defaultWorkingProcess.seoTitle,
        seoDescription: defaultWorkingProcess.seoDescription,
        seoKeywords: defaultWorkingProcess.seoKeywords,
        canonicalUrl: defaultWorkingProcess.canonicalUrl,
        ogImageUrl: defaultWorkingProcess.ogImageUrl,
        twitterImageUrl: defaultWorkingProcess.twitterImageUrl,
        noIndex: defaultWorkingProcess.noIndex,
      },
    });
  }
  return NextResponse.json({ workingProcess: toPayload(settings) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const parsed = workingProcessSectionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = {
    tagline: parsed.data.tagline.trim(),
    titleLine1: parsed.data.titleLine1.trim(),
    titleLine2: parsed.data.titleLine2.trim(),
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

  const settings = await prisma.workingProcessSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({ workingProcess: toPayload(settings) });
}
