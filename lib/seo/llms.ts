import { resolveOrigin } from "@/lib/seo/metadata";
import type { SeoFaqItem, SeoPageContent, SeoSettingsContent } from "@/lib/seo/types";

export type LlmsSource = {
  services: Array<{ title: string; description: string; url: string }>;
  posts: Array<{ title: string; excerpt: string; url: string; publishedAt: string | null }>;
  pages: SeoPageContent[];
  faqs: SeoFaqItem[];
};

export function buildLlmsTxt(settings: SeoSettingsContent, source: LlmsSource): string {
  if (!settings.llmsTxtAutoGenerate && settings.llmsTxtContent.trim()) {
    return settings.llmsTxtContent.trim();
  }

  const origin = resolveOrigin(settings);
  const lines: string[] = [];

  lines.push(`# ${settings.siteName}`);
  lines.push("");
  lines.push(`> ${settings.aiSummary || settings.defaultDescription}`);
  lines.push("");

  if (settings.entityDefinition) {
    lines.push("## About");
    lines.push("");
    lines.push(settings.entityDefinition);
    lines.push("");
  }

  const contactLines: string[] = [];
  if (settings.contactEmail) contactLines.push(`- Email: ${settings.contactEmail}`);
  if (settings.contactPhone) contactLines.push(`- Phone: ${settings.contactPhone}`);
  const address = [
    settings.streetAddress,
    settings.addressLocality,
    settings.addressRegion,
    settings.postalCode,
    settings.addressCountry,
  ]
    .filter(Boolean)
    .join(", ");
  if (address) contactLines.push(`- Address: ${address}`);
  if (settings.areaServed.length) contactLines.push(`- Area served: ${settings.areaServed.join(", ")}`);

  if (contactLines.length) {
    lines.push("## Contact");
    lines.push("");
    lines.push(...contactLines);
    lines.push("");
  }

  if (source.services.length) {
    lines.push("## Services");
    lines.push("");
    for (const service of source.services) {
      lines.push(`- [${service.title}](${origin}${service.url}): ${service.description}`);
    }
    lines.push("");
  }

  if (source.pages.length) {
    lines.push("## Key pages");
    lines.push("");
    for (const page of source.pages) {
      const label = page.label || page.title || page.path;
      const description = page.description || page.aiSummary || "";
      lines.push(`- [${label}](${origin}${page.path})${description ? `: ${description}` : ""}`);
    }
    lines.push("");
  }

  if (source.posts.length) {
    lines.push("## Latest articles");
    lines.push("");
    for (const post of source.posts) {
      lines.push(`- [${post.title}](${origin}${post.url}): ${post.excerpt}`);
    }
    lines.push("");
  }

  if (source.faqs.length) {
    lines.push("## Frequently asked questions");
    lines.push("");
    for (const faq of source.faqs) {
      lines.push(`### ${faq.question}`);
      lines.push("");
      lines.push(faq.answer);
      lines.push("");
    }
  }

  if (settings.aiAnswerTargets.length) {
    lines.push("## Questions this site answers");
    lines.push("");
    for (const target of settings.aiAnswerTargets) {
      lines.push(`- ${target}`);
    }
    lines.push("");
  }

  lines.push("## Machine-readable resources");
  lines.push("");
  if (settings.sitemapEnabled) lines.push(`- [Sitemap](${origin}/sitemap.xml)`);
  if (settings.rssEnabled) lines.push(`- [RSS feed](${origin}/feed.xml)`);
  lines.push(`- [Robots policy](${origin}/robots.txt)`);
  lines.push("");

  if (settings.llmsTxtContent.trim()) {
    lines.push("## Additional notes");
    lines.push("");
    lines.push(settings.llmsTxtContent.trim());
    lines.push("");
  }

  return lines.join("\n");
}
