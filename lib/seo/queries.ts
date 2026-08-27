import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { defaultSeoFaqs, defaultSeoRobotsRules, defaultSeoSettings } from "@/lib/seo/defaults";
import {
  mapSeoFaq,
  mapSeoIntegration,
  mapSeoPage,
  mapSeoRedirect,
  mapSeoRobotsRule,
  mapSeoSchemaBlock,
  mapSeoScript,
  mapSeoSettings,
  mapSeoSitemapEntry,
  normalizePath,
} from "@/lib/seo/mappers";
import type {
  SeoFaqItem,
  SeoIntegrationItem,
  SeoPageContent,
  SeoRedirectItem,
  SeoRobotsRuleItem,
  SeoSchemaItem,
  SeoScriptItem,
  SeoSettingsContent,
  SeoSitemapEntryItem,
} from "@/lib/seo/types";

export const getSeoSettings = cache(async (): Promise<SeoSettingsContent> => {
  try {
    const row = await prisma.seoSettings.findUnique({ where: { id: "default" } });
    return mapSeoSettings(row as Record<string, unknown> | null);
  } catch {
    return defaultSeoSettings;
  }
});

export const getSeoPages = cache(async (): Promise<SeoPageContent[]> => {
  try {
    const rows = await prisma.seoPage.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    return rows.map((row) => mapSeoPage(row as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
});

export const getSeoPage = cache(async (path: string): Promise<SeoPageContent | null> => {
  const normalized = normalizePath(path);
  try {
    const row = await prisma.seoPage.findFirst({
      where: { path: normalized, deletedAt: null, isActive: true },
    });
    return row ? mapSeoPage(row as unknown as Record<string, unknown>) : null;
  } catch {
    return null;
  }
});

export const getSeoScripts = cache(async (): Promise<SeoScriptItem[]> => {
  try {
    const rows = await prisma.seoScript.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    return rows.map((row) => mapSeoScript(row as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
});

export const getSeoIntegrations = cache(async (): Promise<SeoIntegrationItem[]> => {
  try {
    const rows = await prisma.seoIntegration.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    return rows.map((row) => mapSeoIntegration(row as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
});

export const getSeoRobotsRules = cache(async (): Promise<SeoRobotsRuleItem[]> => {
  try {
    const rows = await prisma.seoRobotsRule.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    if (!rows.length) {
      return defaultSeoRobotsRules.map((rule, index) => ({
        ...rule,
        id: `fallback-robots-${index}`,
        deletedAt: null,
      }));
    }
    return rows.map((row) => mapSeoRobotsRule(row as unknown as Record<string, unknown>));
  } catch {
    return defaultSeoRobotsRules.map((rule, index) => ({
      ...rule,
      id: `fallback-robots-${index}`,
      deletedAt: null,
    }));
  }
});

export const getSeoSitemapEntries = cache(async (): Promise<SeoSitemapEntryItem[]> => {
  try {
    const rows = await prisma.seoSitemapEntry.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    return rows.map((row) => mapSeoSitemapEntry(row as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
});

export const getSeoFaqs = cache(async (): Promise<SeoFaqItem[]> => {
  try {
    const rows = await prisma.seoFaq.findMany({
      where: { deletedAt: null, isActive: true, isVisible: true },
      orderBy: { displayOrder: "asc" },
    });
    if (!rows.length) {
      return defaultSeoFaqs.map((faq, index) => ({
        ...faq,
        id: `fallback-faq-${index}`,
        deletedAt: null,
      }));
    }
    return rows.map((row) => mapSeoFaq(row as unknown as Record<string, unknown>));
  } catch {
    return defaultSeoFaqs.map((faq, index) => ({
      ...faq,
      id: `fallback-faq-${index}`,
      deletedAt: null,
    }));
  }
});

export async function getSeoFaqsForPath(path: string): Promise<SeoFaqItem[]> {
  const normalized = normalizePath(path);
  const faqs = await getSeoFaqs();
  return faqs.filter(
    (faq) =>
      faq.scope === "GLOBAL" || (faq.scope === "PAGE" && normalizePath(faq.pagePath) === normalized),
  );
}

export const getSeoSchemaBlocks = cache(async (): Promise<SeoSchemaItem[]> => {
  try {
    const rows = await prisma.seoSchema.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    return rows.map((row) => mapSeoSchemaBlock(row as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
});

export async function getSeoSchemaBlocksForPath(path: string): Promise<SeoSchemaItem[]> {
  const normalized = normalizePath(path);
  const blocks = await getSeoSchemaBlocks();
  return blocks.filter(
    (block) =>
      block.scope === "GLOBAL" ||
      (block.scope === "PAGE" && normalizePath(block.pagePath) === normalized),
  );
}

export const getSeoRedirects = cache(async (): Promise<SeoRedirectItem[]> => {
  try {
    const rows = await prisma.seoRedirect.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    return rows.map((row) => mapSeoRedirect(row as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
});
