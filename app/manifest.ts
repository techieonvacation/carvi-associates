import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/seo/queries";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSeoSettings();

  const icons = settings.manifestIcons.length
    ? settings.manifestIcons.map((icon) => ({
        src: icon.src,
        sizes: icon.sizes,
        type: icon.type,
        purpose: (icon.purpose || "any") as "any" | "maskable" | "monochrome",
      }))
    : [
        { src: settings.faviconSmallUrl, sizes: "16x16", type: "image/png" },
        { src: settings.faviconUrl, sizes: "32x32", type: "image/png" },
        { src: settings.appleTouchIconUrl, sizes: "180x180", type: "image/png" },
      ].filter((icon) => Boolean(icon.src));

  return {
    name: settings.manifestName || settings.siteName,
    short_name: settings.manifestShortName || settings.siteShortName,
    description: settings.manifestDescription || settings.defaultDescription,
    start_url: settings.manifestStartUrl || "/",
    scope: "/",
    display: settings.manifestDisplay as MetadataRoute.Manifest["display"],
    background_color: settings.manifestBackgroundColor,
    theme_color: settings.themeColorLight,
    lang: settings.siteLanguage,
    dir: "ltr",
    categories: settings.categoryMeta ? [settings.categoryMeta.toLowerCase()] : undefined,
    icons,
  };
}
