import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  defaultAbout,
  defaultBookAppointment,
  defaultFeatures,
  defaultHeader,
  defaultHero,
  defaultHeroStats,
  defaultHeroTrust,
  defaultNavItems,
  defaultPartnerMarqueeLabel,
  defaultPartners,
  defaultServices,
  defaultServicesSection,
  defaultSocialLinks,
  defaultTeam,
  defaultTopbar,
  defaultWhyChoose,
  defaultWorkingProcess,
} from "@/lib/cms/defaults";
import { mapServiceRow } from "@/lib/cms/service-mappers";
import type {
  AboutContent,
  AboutTab,
  BookAppointmentContent,
  FeatureItem,
  HeroStat,
  HeroTrustItem,
  PartnerMarqueeItem,
  PartnerVariant,
  ServicesContent,
  TeamContent,
  TeamMemberItem,
  TeamMemberSocial,
  WhyChooseContent,
  WhyChooseItem,
  WorkingProcessContent,
  WorkingProcessStepItem,
} from "@/lib/cms/types";
import { PARTNER_VARIANTS } from "@/lib/cms/types";

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
    description: string;
    secondaryCtaText: string;
    ctaText: string;
    ctaHref: string;
    videoId: string | null;
    heroImageUrl: string;
    activeUserCount: number;
    activeUserSuffix: string;
    activeUserLabel: string;
    activeUserImages: string[];
    stats: HeroStat[];
    trust: HeroTrustItem[];
  };
  header: {
    contactCtaText: string;
    contactCtaHref: string;
  };
  partnerMarquee: {
    label: string;
    partners: PartnerMarqueeItem[];
  };
  features: FeatureItem[];
  about: AboutContent;
  services: ServicesContent;
  bookAppointment: BookAppointmentContent;
  whyChoose: WhyChooseContent;
  team: TeamContent;
  workingProcess: WorkingProcessContent;
};

function parseActiveUserImages(value: unknown): string[] {
  if (!Array.isArray(value)) return defaultHero.activeUserImages;
  return value.filter((item): item is string => typeof item === "string");
}

function parseHeroStats(value: unknown): HeroStat[] {
  if (!Array.isArray(value) || value.length === 0) return defaultHeroStats;
  const stats = value.filter((item): item is HeroStat => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<HeroStat>;
    return (
      typeof candidate.icon === "string" &&
      typeof candidate.end === "number" &&
      typeof candidate.suffix === "string" &&
      typeof candidate.label === "string"
    );
  });
  return stats.length ? stats : defaultHeroStats;
}

function parseHeroTrust(value: unknown): HeroTrustItem[] {
  if (!Array.isArray(value) || value.length === 0) return defaultHeroTrust;
  const trust = value.filter((item): item is HeroTrustItem => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<HeroTrustItem>;
    return typeof candidate.icon === "string" && typeof candidate.label === "string";
  });
  return trust.length ? trust : defaultHeroTrust;
}

function parsePartnerVariant(value: unknown): PartnerVariant {
  if (
    typeof value === "string" &&
    (PARTNER_VARIANTS as readonly string[]).includes(value)
  ) {
    return value as PartnerVariant;
  }
  return "default";
}

function parseAboutTabs(value: unknown): AboutTab[] {
  if (!Array.isArray(value) || value.length === 0) return defaultAbout.tabs;
  const tabs = value.filter((item): item is AboutTab => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<AboutTab>;
    return (
      typeof candidate.id === "string" &&
      typeof candidate.label === "string" &&
      typeof candidate.image === "string"
    );
  });
  return tabs.length ? tabs : defaultAbout.tabs;
}

function parseAboutChecklist(value: unknown): string[] {
  if (!Array.isArray(value) || value.length === 0) return defaultAbout.checklist;
  const checklist = value.filter((item): item is string => typeof item === "string" && item.length > 0);
  return checklist.length ? checklist : defaultAbout.checklist;
}

function mapAboutSettings(row: {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  text: string;
  experienceValue: string;
  experienceLabel: string;
  collageOneUrl: string;
  collageTwoUrl: string;
  collageOneAlt: string;
  collageTwoAlt: string;
  defaultTabId: string | null;
  taglineBg: string;
  tabs: unknown;
  checklist: unknown;
}): AboutContent {
  const tabs = parseAboutTabs(row.tabs);
  const defaultTabId =
    row.defaultTabId && tabs.some((tab) => tab.id === row.defaultTabId)
      ? row.defaultTabId
      : (tabs[1]?.id ?? tabs[0]?.id ?? null);

  return {
    tagline: row.tagline,
    title: [row.titleLine1, row.titleLine2],
    text: row.text,
    experience: {
      value: row.experienceValue,
      label: row.experienceLabel,
    },
    images: {
      collageOne: row.collageOneUrl,
      collageTwo: row.collageTwoUrl,
    },
    collageOneAlt: row.collageOneAlt || defaultAbout.collageOneAlt,
    collageTwoAlt: row.collageTwoAlt || defaultAbout.collageTwoAlt,
    defaultTabId,
    taglineBg: row.taglineBg || defaultAbout.taglineBg,
    tabs,
    checklist: parseAboutChecklist(row.checklist),
  };
}

function mapServicesSection(row: {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  cardTagline: string;
  taglineBg: string;
  isVisible: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  twitterImageUrl: string | null;
  noIndex: boolean;
}): ServicesContent["section"] {
  return {
    tagline: row.tagline,
    title: [row.titleLine1, row.titleLine2],
    cardTagline: row.cardTagline,
    taglineBg: row.taglineBg || defaultServicesSection.taglineBg,
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

function mapBookAppointment(row: {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  backgroundImageUrl: string;
  backgroundImageAlt: string;
  taglineBg: string;
  isVisible: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  twitterImageUrl: string | null;
  noIndex: boolean;
}): BookAppointmentContent {
  return {
    tagline: row.tagline,
    title: [row.titleLine1, row.titleLine2],
    description: row.description,
    primaryButtonText: row.primaryButtonText,
    primaryButtonHref: row.primaryButtonHref,
    secondaryButtonText: row.secondaryButtonText,
    secondaryButtonHref: row.secondaryButtonHref,
    backgroundImageUrl: row.backgroundImageUrl,
    backgroundImageAlt: row.backgroundImageAlt,
    taglineBg: row.taglineBg || defaultBookAppointment.taglineBg,
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

export function mapWhyChooseItem(row: {
  id: string;
  icon: string;
  title: string;
  text: string;
  href: string;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): WhyChooseItem {
  return {
    id: row.id,
    icon: row.icon,
    title: row.title,
    text: row.text,
    href: row.href,
    displayOrder: row.displayOrder,
    isVisible: row.isVisible,
    isActive: row.isActive,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function mapWhyChooseSection(
  row: {
    tagline: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    taglineBg: string;
    imageUrl: string;
    imageAlt: string;
    shapeImageUrl: string;
    isVisible: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    seoKeywords: string | null;
    canonicalUrl: string | null;
    ogImageUrl: string | null;
    twitterImageUrl: string | null;
    noIndex: boolean;
  },
  items: WhyChooseItem[],
): WhyChooseContent {
  return {
    tagline: row.tagline,
    title: [row.titleLine1, row.titleLine2],
    description: row.description,
    taglineBg: row.taglineBg || defaultWhyChoose.taglineBg,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt || defaultWhyChoose.imageAlt,
    shapeImageUrl: row.shapeImageUrl || defaultWhyChoose.shapeImageUrl,
    isVisible: row.isVisible,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    seoKeywords: row.seoKeywords,
    canonicalUrl: row.canonicalUrl,
    ogImageUrl: row.ogImageUrl,
    twitterImageUrl: row.twitterImageUrl,
    noIndex: row.noIndex,
    items,
  };
}

function parseTeamSocials(value: unknown): TeamMemberSocial[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is TeamMemberSocial => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<TeamMemberSocial>;
    return (
      typeof candidate.label === "string" &&
      typeof candidate.href === "string" &&
      typeof candidate.icon === "string"
    );
  });
}

export function mapTeamMember(row: {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  socials: unknown;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): TeamMemberItem {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    href: row.href,
    socials: parseTeamSocials(row.socials),
    displayOrder: row.displayOrder,
    isVisible: row.isVisible,
    isActive: row.isActive,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function mapTeamSection(
  row: {
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
  },
  members: TeamMemberItem[],
): TeamContent {
  return {
    tagline: row.tagline,
    title: [row.titleLine1, row.titleLine2],
    taglineBg: row.taglineBg || defaultTeam.taglineBg,
    isVisible: row.isVisible,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    seoKeywords: row.seoKeywords,
    canonicalUrl: row.canonicalUrl,
    ogImageUrl: row.ogImageUrl,
    twitterImageUrl: row.twitterImageUrl,
    noIndex: row.noIndex,
    members,
  };
}

export function mapWorkingProcessStep(row: {
  id: string;
  stepLabel: string;
  title: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): WorkingProcessStepItem {
  return {
    id: row.id,
    stepLabel: row.stepLabel,
    title: row.title,
    text: row.text,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    href: row.href,
    displayOrder: row.displayOrder,
    isVisible: row.isVisible,
    isActive: row.isActive,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function mapWorkingProcessSection(
  row: {
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
  },
  steps: WorkingProcessStepItem[],
): WorkingProcessContent {
  return {
    tagline: row.tagline,
    title: [row.titleLine1, row.titleLine2],
    taglineBg: row.taglineBg || defaultWorkingProcess.taglineBg,
    isVisible: row.isVisible,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    seoKeywords: row.seoKeywords,
    canonicalUrl: row.canonicalUrl,
    ogImageUrl: row.ogImageUrl,
    twitterImageUrl: row.twitterImageUrl,
    noIndex: row.noIndex,
    steps,
  };
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const [
    navItems,
    socialLinks,
    topbar,
    hero,
    header,
    partnerSettings,
    partners,
    features,
    about,
    servicesSection,
    services,
    bookAppointment,
    whyChooseSettings,
    whyChooseItems,
    teamSettings,
    teamMembers,
    workingProcessSettings,
    workingProcessSteps,
  ] = await Promise.all([
    prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.topbarSettings.findUnique({ where: { id: "default" } }),
    prisma.heroSettings.findUnique({ where: { id: "default" } }),
    prisma.headerSettings.findUnique({ where: { id: "default" } }),
    prisma.partnerMarqueeSettings.findUnique({ where: { id: "default" } }),
    prisma.partner.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.feature.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.aboutSettings.findUnique({ where: { id: "default" } }),
    prisma.servicesSectionSettings.findUnique({ where: { id: "default" } }),
    prisma.service.findMany({
      where: { deletedAt: null, isVisible: true, isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.bookAppointmentSettings.findUnique({ where: { id: "default" } }),
    prisma.whyChooseSettings.findUnique({ where: { id: "default" } }),
    prisma.whyChooseItem.findMany({
      where: { deletedAt: null, isVisible: true, isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.teamSettings.findUnique({ where: { id: "default" } }),
    prisma.teamMember.findMany({
      where: { deletedAt: null, isVisible: true, isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.workingProcessSettings.findUnique({ where: { id: "default" } }),
    prisma.workingProcessStep.findMany({
      where: { deletedAt: null, isVisible: true, isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
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
          tagline: hero.tagline,
          titleBeforeVideo: hero.titleBeforeVideo,
          titleHighlight: hero.titleHighlight,
          titleAfterVideo: hero.titleAfterVideo,
          description: hero.description || defaultHero.description,
          secondaryCtaText: hero.secondaryCtaText || defaultHero.secondaryCtaText,
          ctaText: hero.ctaText,
          ctaHref: hero.ctaHref,
          videoId: hero.videoId,
          heroImageUrl: hero.heroImageUrl,
          activeUserCount: hero.activeUserCount,
          activeUserSuffix: hero.activeUserSuffix,
          activeUserLabel: hero.activeUserLabel,
          activeUserImages: parseActiveUserImages(hero.activeUserImages),
          stats: parseHeroStats(hero.stats),
          trust: parseHeroTrust(hero.trust),
        }
      : defaultHero,
    header: header ?? defaultHeader,
    partnerMarquee: {
      label: partnerSettings?.label ?? defaultPartnerMarqueeLabel,
      partners: partners.length
        ? partners.map((partner) => ({
            id: partner.id,
            name: partner.name,
            tagline: partner.tagline,
            logoUrl: partner.logoUrl,
            variant: parsePartnerVariant(partner.variant),
            sortOrder: partner.sortOrder,
            visible: partner.visible,
          }))
        : defaultPartners.map((partner, index) => ({
            id: `fallback-partner-${index}`,
            ...partner,
          })),
    },
    features: features.length
      ? features.map((feature) => ({
          id: feature.id,
          icon: feature.icon,
          title: feature.title,
          text: feature.text,
          href: feature.href,
          sortOrder: feature.sortOrder,
          visible: feature.visible,
        }))
      : defaultFeatures.map((feature, index) => ({
          id: `fallback-feature-${index}`,
          ...feature,
        })),
    about: about ? mapAboutSettings(about) : defaultAbout,
    services: {
      section: servicesSection
        ? mapServicesSection(servicesSection)
        : defaultServicesSection,
      items: services.length
        ? services.map(mapServiceRow)
        : defaultServices.map((service, index) => ({
            id: `fallback-service-${index}`,
            ...service,
          })),
    },
    bookAppointment: bookAppointment
      ? mapBookAppointment(bookAppointment)
      : defaultBookAppointment,
    whyChoose: whyChooseSettings
      ? mapWhyChooseSection(
          whyChooseSettings,
          whyChooseItems.length
            ? whyChooseItems.map(mapWhyChooseItem)
            : defaultWhyChoose.items,
        )
      : defaultWhyChoose,
    team: teamSettings
      ? mapTeamSection(
          teamSettings,
          teamMembers.length
            ? teamMembers.map(mapTeamMember)
            : defaultTeam.members,
        )
      : defaultTeam,
    workingProcess: workingProcessSettings
      ? mapWorkingProcessSection(
          workingProcessSettings,
          workingProcessSteps.length
            ? workingProcessSteps.map(mapWorkingProcessStep)
            : defaultWorkingProcess.steps,
        )
      : defaultWorkingProcess,
  };
});
