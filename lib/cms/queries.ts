import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  defaultHeader,
  defaultHero,
  defaultNavItems,
  defaultSocialLinks,
  defaultTopbar,
} from "@/lib/cms/defaults";

export type SiteContent = {
  navItems: Array<{
    id: string;
    label: string;
    href: string;
    sortOrder: number;
    visible: boolean;
  }>;
  socialLinks: Array<{
    id: string;
    label: string;
    href: string;
    icon: string;
    sortOrder: number;
    visible: boolean;
  }>;
  topbar: {
    email: string;
    address: string;
    addressMapUrl: string;
    phone: string;
    phoneHref: string;
    whatsappLabel: string;
    whatsappHref: string;
  };
  hero: {
    tagline: string;
    titleBeforeVideo: string;
    titleHighlight: string;
    titleAfterVideo: string;
    ctaText: string;
    ctaHref: string;
    videoId: string | null;
    heroImageUrl: string;
    activeUserCount: number;
    activeUserSuffix: string;
    activeUserLabel: string;
    activeUserImages: string[];
  };
  header: {
    contactCtaText: string;
    contactCtaHref: string;
  };
};

function parseActiveUserImages(value: unknown): string[] {
  if (!Array.isArray(value)) return defaultHero.activeUserImages;
  return value.filter((item): item is string => typeof item === "string");
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const [navItems, socialLinks, topbar, hero, header] = await Promise.all([
    prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.topbarSettings.findUnique({ where: { id: "default" } }),
    prisma.heroSettings.findUnique({ where: { id: "default" } }),
    prisma.headerSettings.findUnique({ where: { id: "default" } }),
  ]);

  return {
    navItems: navItems.length
      ? navItems
      : defaultNavItems.map((item, index) => ({
          id: `fallback-${index}`,
          ...item,
        })),
    socialLinks: socialLinks.length
      ? socialLinks
      : defaultSocialLinks.map((item, index) => ({
          id: `fallback-${index}`,
          ...item,
        })),
    topbar: topbar ?? defaultTopbar,
    hero: hero
      ? {
          ...hero,
          activeUserImages: parseActiveUserImages(hero.activeUserImages),
        }
      : defaultHero,
    header: header ?? defaultHeader,
  };
});
