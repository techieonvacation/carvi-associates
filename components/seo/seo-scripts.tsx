import Script from "next/script";
import { getSeoIntegrations, getSeoScripts, getSeoSettings } from "@/lib/seo/queries";
import {
  providerScriptDomains,
  renderIntegration,
  type RenderedTag,
} from "@/lib/seo/providers";
import { SEO_SCRIPT_STRATEGY_VALUE, type SeoScriptItem, type SeoScriptPlacement } from "@/lib/seo/types";
import { RawHtml } from "@/components/seo/raw-html";

function matchesPath(item: SeoScriptItem, pathname: string): boolean {
  if (item.scope === "ALL") return true;
  const matched = item.pathPatterns.some((pattern) => {
    const value = pattern.trim();
    if (!value) return false;
    if (value.endsWith("*")) return pathname.startsWith(value.slice(0, -1));
    return pathname === value;
  });
  return item.scope === "INCLUDE" ? matched : !matched;
}

function scriptToTag(item: SeoScriptItem): RenderedTag {
  return {
    key: `seo-script-${item.id}`,
    placement: item.placement,
    src: item.scriptSrc.trim() || undefined,
    inline: item.inlineCode.trim() || undefined,
    strategy: SEO_SCRIPT_STRATEGY_VALUE[item.strategy],
    isAsync: item.isAsync,
    isDefer: item.isDefer,
  };
}

function renderTag(tag: RenderedTag) {
  const attributes = {
    id: tag.key,
    strategy: tag.strategy,
    async: tag.isAsync || undefined,
    defer: tag.isDefer || undefined,
  } as const;

  if (tag.src) {
    return <Script key={tag.key} {...attributes} src={tag.src} />;
  }

  if (tag.inline) {
    return (
      <Script key={tag.key} {...attributes} dangerouslySetInnerHTML={{ __html: tag.inline }} />
    );
  }

  return null;
}

type SeoScriptsProps = {
  placement: SeoScriptPlacement;
  pathname: string;
};

export async function SeoScripts({ placement, pathname }: SeoScriptsProps) {
  if (pathname.startsWith("/admin")) return null;

  const [settings, scripts, integrations] = await Promise.all([
    getSeoSettings(),
    getSeoScripts(),
    getSeoIntegrations(),
  ]);

  const integrationTags = integrations.flatMap((integration) => renderIntegration(integration));
  const customTags = scripts
    .filter((item) => matchesPath(item, pathname))
    .map((item) => scriptToTag(item));

  const tags = [...integrationTags, ...customTags].filter((tag) => tag.placement === placement);

  const customHtml =
    placement === "HEAD"
      ? settings.customHeadHtml
      : placement === "BODY_START"
        ? settings.customBodyStartHtml
        : settings.customBodyEndHtml;

  const preconnectUrls = [
    ...new Set([...settings.preconnectUrls, ...providerScriptDomains(integrations)]),
  ];

  return (
    <>
      {placement === "HEAD"
        ? preconnectUrls.map((url) => (
            <link key={`preconnect-${url}`} rel="preconnect" href={url} crossOrigin="anonymous" />
          ))
        : null}
      {placement === "HEAD"
        ? settings.dnsPrefetchUrls.map((url) => (
            <link key={`dns-prefetch-${url}`} rel="dns-prefetch" href={url} />
          ))
        : null}
      {tags.map((tag) => renderTag(tag))}
      {placement === "BODY_START"
        ? integrationTags
            .filter((tag) => tag.noscript)
            .map((tag) => (
              <noscript
                key={`${tag.key}-noscript`}
                dangerouslySetInnerHTML={{ __html: tag.noscript ?? "" }}
              />
            ))
        : null}
      <RawHtml html={customHtml} />
    </>
  );
}
