import { AI_CRAWLER_AGENTS, type SeoRobotsRuleItem, type SeoSettingsContent } from "@/lib/seo/types";
import { resolveOrigin } from "@/lib/seo/metadata";

function ruleBlock(rule: SeoRobotsRuleItem): string {
  const lines: string[] = [`User-agent: ${rule.userAgent}`];
  for (const path of rule.allowPaths) lines.push(`Allow: ${path}`);
  for (const path of rule.disallowPaths) lines.push(`Disallow: ${path}`);
  if (typeof rule.crawlDelay === "number") lines.push(`Crawl-delay: ${rule.crawlDelay}`);
  return lines.join("\n");
}

export function buildRobotsTxt(
  settings: SeoSettingsContent,
  rules: SeoRobotsRuleItem[],
  extraSitemaps: string[] = [],
): string {
  if (!settings.robotsEnabled) {
    return ["User-agent: *", "Disallow: /"].join("\n");
  }

  if (settings.robotsUseCustom && settings.robotsCustomContent.trim()) {
    return settings.robotsCustomContent.trim();
  }

  const origin = resolveOrigin(settings);
  const blocks: string[] = [];

  if (!settings.indexingEnabled) {
    blocks.push(["User-agent: *", "Disallow: /"].join("\n"));
    return blocks.join("\n\n");
  }

  const activeRules = rules.filter((rule) => rule.isActive && !rule.deletedAt);
  const baseRules = activeRules.length
    ? activeRules
    : [
        {
          id: "default",
          userAgent: "*",
          allowPaths: ["/"],
          disallowPaths: ["/admin", "/api/"],
          crawlDelay: null,
          notes: "",
          isActive: true,
          displayOrder: 0,
          deletedAt: null,
        } satisfies SeoRobotsRuleItem,
      ];

  for (const rule of baseRules) {
    const withDelay: SeoRobotsRuleItem =
      rule.crawlDelay === null && settings.robotsCrawlDelay !== null
        ? { ...rule, crawlDelay: settings.robotsCrawlDelay }
        : rule;
    blocks.push(ruleBlock(withDelay));
  }

  if (settings.blockAiCrawlers) {
    const allowed = new Set(settings.allowedAiCrawlers);
    const blocked = AI_CRAWLER_AGENTS.filter((agent) => !allowed.has(agent));
    for (const agent of blocked) {
      blocks.push([`User-agent: ${agent}`, "Disallow: /"].join("\n"));
    }
    for (const agent of settings.allowedAiCrawlers) {
      blocks.push([`User-agent: ${agent}`, "Allow: /"].join("\n"));
    }
  }

  if (settings.robotsExtraLines.trim()) {
    blocks.push(settings.robotsExtraLines.trim());
  }

  const tail: string[] = [];
  if (settings.sitemapEnabled) tail.push(`Sitemap: ${origin}/sitemap.xml`);
  if (settings.rssEnabled) tail.push(`Sitemap: ${origin}/feed.xml`);
  for (const sitemap of extraSitemaps) tail.push(`Sitemap: ${sitemap}`);
  if (settings.llmsTxtEnabled) tail.push(`# LLM policy: ${origin}/llms.txt`);

  const host = settings.robotsHost.trim() || origin.replace(/^https?:\/\//, "");
  if (host) tail.push(`Host: ${host}`);

  if (tail.length) blocks.push(tail.join("\n"));

  return blocks.join("\n\n");
}
