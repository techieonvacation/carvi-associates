import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { runSeoAudit } from "@/lib/seo/audit";
import {
  mapSeoFaq,
  mapSeoIntegration,
  mapSeoPage,
  mapSeoRedirect,
  mapSeoSchemaBlock,
  mapSeoSettings,
} from "@/lib/seo/mappers";

export async function GET() {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const [settingsRow, pageRows, redirectRows, integrationRows, faqRows, schemaRows, posts] =
    await Promise.all([
      prisma.seoSettings.findUnique({ where: { id: "default" } }),
      prisma.seoPage.findMany({ where: { deletedAt: null }, orderBy: { displayOrder: "asc" } }),
      prisma.seoRedirect.findMany({ where: { deletedAt: null } }),
      prisma.seoIntegration.findMany({ where: { deletedAt: null } }),
      prisma.seoFaq.findMany({ where: { deletedAt: null, isActive: true } }),
      prisma.seoSchema.findMany({ where: { deletedAt: null, isActive: true } }),
      prisma.blogPost.findMany({
        where: { deletedAt: null, status: "PUBLISHED", isVisible: true, isActive: true },
        select: { seoDescription: true, ogImageUrl: true },
      }),
    ]);

  const report = runSeoAudit({
    settings: mapSeoSettings(settingsRow as Record<string, unknown> | null),
    pages: pageRows.map((row) => mapSeoPage(row as unknown as Record<string, unknown>)),
    redirects: redirectRows.map((row) => mapSeoRedirect(row as unknown as Record<string, unknown>)),
    integrations: integrationRows.map((row) =>
      mapSeoIntegration(row as unknown as Record<string, unknown>),
    ),
    faqs: faqRows.map((row) => mapSeoFaq(row as unknown as Record<string, unknown>)),
    schemas: schemaRows.map((row) => mapSeoSchemaBlock(row as unknown as Record<string, unknown>)),
    blogStats: {
      total: posts.length,
      missingDescription: posts.filter((post) => !post.seoDescription?.trim()).length,
      missingOgImage: posts.filter((post) => !post.ogImageUrl?.trim()).length,
    },
  });

  return NextResponse.json({ audit: report });
}
