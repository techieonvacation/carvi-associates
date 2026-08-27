import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultSeoSettings } from "@/lib/seo/defaults";
import { mapSeoSettings } from "@/lib/seo/mappers";
import { seoSettingsSchema } from "@/lib/seo/schemas";
import { invalidateRedirectCache } from "@/lib/seo/redirects";

export async function GET() {
  const row = await prisma.seoSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json({ settings: mapSeoSettings(row as Record<string, unknown> | null) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = seoSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const input = parsed.data;
  const data = {
    ...input,
    siteUrl: input.siteUrl.trim().replace(/\/+$/, ""),
    canonicalHost: input.canonicalHost.trim().replace(/\/+$/, ""),
    alternateLocales: input.alternateLocales as never,
    customVerifications: input.customVerifications as never,
    areaServed: input.areaServed as never,
    openingHours: input.openingHours as never,
    sameAs: input.sameAs as never,
    contactPoints: input.contactPoints as never,
    knowsAbout: input.knowsAbout as never,
    awards: input.awards as never,
    speakableSelectors: input.speakableSelectors as never,
    aiAnswerTargets: input.aiAnswerTargets as never,
    manifestIcons: input.manifestIcons as never,
    preconnectUrls: input.preconnectUrls as never,
    dnsPrefetchUrls: input.dnsPrefetchUrls as never,
    hreflangEntries: input.hreflangEntries as never,
    allowedAiCrawlers: input.allowedAiCrawlers as never,
  };

  const row = await prisma.seoSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  invalidateRedirectCache();

  return NextResponse.json({ settings: mapSeoSettings(row as Record<string, unknown>) });
}

export async function POST() {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const data = defaultSeoSettings as unknown as Record<string, unknown>;

  const row = await prisma.seoSettings.upsert({
    where: { id: "default" },
    update: data as never,
    create: { id: "default", ...data } as never,
  });

  return NextResponse.json({ settings: mapSeoSettings(row as Record<string, unknown>) });
}
