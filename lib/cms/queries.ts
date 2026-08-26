import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  defaultAbout,
  defaultBookAppointment,
  defaultContact,
  defaultFeatures,
  defaultHero,
  defaultHeroStats,
  defaultHeroTrust,
  defaultMarquee,
  defaultNavItems,
  defaultPartnerMarqueeLabel,
  defaultPartners,
  defaultServices,
  defaultServicesSection,
  defaultSocialLinks,
  defaultFooter,
  defaultFooterLinks,
  defaultFooterRecentPosts,
  defaultFooterSocials,
  defaultTeam,
  defaultTopbar,
  defaultWhyChoose,
  defaultWorkingProcess,
} from "@/lib/cms/defaults";
import { mapHeader } from "@/lib/cms/header-mappers";
import { mapServiceRow } from "@/lib/cms/service-mappers";
import type {
  AboutContent,
  AboutTab,
  BookAppointmentContent,
  ContactContent,
  FeatureItem,
  FooterContent,
  FooterLinkColumn,
  FooterNavLink,
  FooterRecentPostItem,
  FooterSocialItem,
  HeaderContent,
  HeroStat,
  HeroTrustItem,
  ImageFit,
  MarqueeContent,
  MarqueeDirection,
  MarqueeItemData,
  MarqueeLayout,
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
import {
  FOOTER_LINK_COLUMNS,
  IMAGE_FIT_OPTIONS,
  MARQUEE_DIRECTIONS,
  MARQUEE_LAYOUTS,
  PARTNER_VARIANTS,
} from "@/lib/cms/types";

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
    openHours: string;
    noteLabel: string;
    noteText: string;
    showNote: boolean;
    socialsTitle: string;
    showSocials: boolean;
    whatsappLabel: string;
    whatsappHref: string;
    whatsappIntroText: string;
    whatsappLinkText: string;
    showWhatsappNotice: boolean;
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
  header: HeaderContent;
  partnerMarquee: {
    label: string;
    partners: PartnerMarqueeItem[];
  };
  features: FeatureItem[];
  about: AboutContent;
  services: ServicesContent;
  bookAppointment: BookAppointmentContent;
  whyChoose: WhyChooseContent;
  marquee: MarqueeContent;
  team: TeamContent;
  workingProcess: WorkingProcessContent;
  contact: ContactContent;
  footer: FooterContent;
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

export function parseImageFit(value: unknown): ImageFit {
  if (
    typeof value === "string" &&
    (IMAGE_FIT_OPTIONS as readonly string[]).includes(value)
  ) {
    return value as ImageFit;
  }
  return "cover";
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
    imageFit: string;
    imageMinHeightPx: number;
    showImageShape: boolean;
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
    imageFit: parseImageFit(row.imageFit),
    imageMinHeightPx: row.imageMinHeightPx || defaultWhyChoose.imageMinHeightPx,
    showImageShape: row.showImageShape,
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

function parseMarqueeDirection(value: unknown): MarqueeDirection {
  if (
    typeof value === "string" &&
    (MARQUEE_DIRECTIONS as readonly string[]).includes(value)
  ) {
    return value as MarqueeDirection;
  }
  return "left";
}

export function mapMarqueeItem(row: {
  id: string;
  kind: string;
  band: string;
  text: string;
  imageUrl: string | null;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  href: string | null;
  outlined: boolean;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): MarqueeItemData {
  return {
    id: row.id,
    kind: row.kind as MarqueeItemData["kind"],
    band: row.band as MarqueeItemData["band"],
    text: row.text,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    imageWidth: row.imageWidth,
    imageHeight: row.imageHeight,
    href: row.href,
    outlined: row.outlined,
    displayOrder: row.displayOrder,
    isVisible: row.isVisible,
    isActive: row.isActive,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function parseMarqueeLayout(value: unknown): MarqueeLayout {
  if (
    typeof value === "string" &&
    (MARQUEE_LAYOUTS as readonly string[]).includes(value)
  ) {
    return value as MarqueeLayout;
  }
  return "stacked";
}

function mapMarqueeSettings(
  row: {
    ariaLabel: string;
    layout: string;
    isVisible: boolean;
    showBandOne: boolean;
    showBandTwo: boolean;
    bandOneBgColor: string;
    bandOneTextColor: string;
    bandTwoBgColor: string;
    bandTwoTextColor: string;
    bandOneDirection: string;
    bandTwoDirection: string;
    bandOneSpeedSeconds: number;
    bandTwoSpeedSeconds: number;
    bandOneSeparatorUrl: string;
    bandTwoSeparatorUrl: string;
    showSeparator: boolean;
    skewDegrees: number;
    fontSizePx: number;
    itemGapPx: number;
    bandPaddingPx: number;
    alternateOutline: boolean;
    pauseOnHover: boolean;
  },
  items: MarqueeItemData[],
): MarqueeContent {
  return {
    ariaLabel: row.ariaLabel || defaultMarquee.ariaLabel,
    layout: parseMarqueeLayout(row.layout),
    isVisible: row.isVisible,
    showBandOne: row.showBandOne,
    showBandTwo: row.showBandTwo,
    bandOneBgColor: row.bandOneBgColor || defaultMarquee.bandOneBgColor,
    bandOneTextColor: row.bandOneTextColor || defaultMarquee.bandOneTextColor,
    bandTwoBgColor: row.bandTwoBgColor || defaultMarquee.bandTwoBgColor,
    bandTwoTextColor: row.bandTwoTextColor || defaultMarquee.bandTwoTextColor,
    bandOneDirection: parseMarqueeDirection(row.bandOneDirection),
    bandTwoDirection: parseMarqueeDirection(row.bandTwoDirection),
    bandOneSpeedSeconds: row.bandOneSpeedSeconds || defaultMarquee.bandOneSpeedSeconds,
    bandTwoSpeedSeconds: row.bandTwoSpeedSeconds || defaultMarquee.bandTwoSpeedSeconds,
    bandOneSeparatorUrl: row.bandOneSeparatorUrl || defaultMarquee.bandOneSeparatorUrl,
    bandTwoSeparatorUrl: row.bandTwoSeparatorUrl || defaultMarquee.bandTwoSeparatorUrl,
    showSeparator: row.showSeparator,
    skewDegrees: row.skewDegrees,
    fontSizePx: row.fontSizePx || defaultMarquee.fontSizePx,
    itemGapPx: row.itemGapPx || defaultMarquee.itemGapPx,
    bandPaddingPx: row.bandPaddingPx,
    alternateOutline: row.alternateOutline,
    pauseOnHover: row.pauseOnHover,
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
    backgroundImageUrl: string;
    backgroundImageAlt: string;
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
    backgroundImageUrl: row.backgroundImageUrl.trim(),
    backgroundImageAlt: row.backgroundImageAlt.trim(),
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

function mapContactSection(row: {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  taglineBg: string;
  phoneTitle: string;
  phoneText: string;
  phoneHref: string;
  showPhone: boolean;
  emailTitle: string;
  emailText: string;
  showEmail: boolean;
  locationTitle: string;
  locationText: string;
  locationUrl: string;
  showLocation: boolean;
  nameLabel: string;
  companyLabel: string;
  emailLabel: string;
  mobileLabel: string;
  locationLabel: string;
  messageLabel: string;
  submitLabel: string;
  sideImageUrl: string;
  sideImageAlt: string;
  showSideImage: boolean;
  showShape: boolean;
  isVisible: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  twitterImageUrl: string | null;
  noIndex: boolean;
}): ContactContent {
  return {
    tagline: row.tagline,
    title: [row.titleLine1, row.titleLine2],
    taglineBg: row.taglineBg || defaultContact.taglineBg,
    phoneTitle: row.phoneTitle,
    phoneText: row.phoneText.trim(),
    phoneHref: row.phoneHref.trim(),
    showPhone: row.showPhone,
    emailTitle: row.emailTitle,
    emailText: row.emailText.trim(),
    showEmail: row.showEmail,
    locationTitle: row.locationTitle,
    locationText: row.locationText.trim(),
    locationUrl: row.locationUrl.trim(),
    showLocation: row.showLocation,
    nameLabel: row.nameLabel,
    companyLabel: row.companyLabel,
    emailLabel: row.emailLabel,
    mobileLabel: row.mobileLabel,
    locationLabel: row.locationLabel,
    messageLabel: row.messageLabel,
    submitLabel: row.submitLabel,
    sideImageUrl: row.sideImageUrl.trim(),
    sideImageAlt: row.sideImageAlt.trim(),
    showSideImage: row.showSideImage,
    showShape: row.showShape,
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

function parseFooterColumn(value: unknown): FooterLinkColumn {
  if (
    typeof value === "string" &&
    (FOOTER_LINK_COLUMNS as readonly string[]).includes(value)
  ) {
    return value as FooterLinkColumn;
  }
  return "LINKS_ONE";
}

export function mapFooterLink(row: {
  id: string;
  label: string;
  href: string;
  column: string;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: Date | null;
}): FooterNavLink {
  return {
    id: row.id,
    label: row.label,
    href: row.href,
    column: parseFooterColumn(row.column),
    displayOrder: row.displayOrder,
    isVisible: row.isVisible,
    isActive: row.isActive,
    deletedAt: row.deletedAt?.toISOString() ?? null,
  };
}

export function mapFooterRecentPost(row: {
  id: string;
  title: string;
  dateLabel: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: Date | null;
}): FooterRecentPostItem {
  return {
    id: row.id,
    title: row.title,
    dateLabel: row.dateLabel,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    href: row.href,
    displayOrder: row.displayOrder,
    isVisible: row.isVisible,
    isActive: row.isActive,
    deletedAt: row.deletedAt?.toISOString() ?? null,
  };
}

export function mapFooterSocial(row: {
  id: string;
  label: string;
  href: string;
  icon: string;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: Date | null;
}): FooterSocialItem {
  return {
    id: row.id,
    label: row.label,
    href: row.href,
    icon: row.icon,
    displayOrder: row.displayOrder,
    isVisible: row.isVisible,
    isActive: row.isActive,
    deletedAt: row.deletedAt?.toISOString() ?? null,
  };
}

function mapFooterContent(
  row: {
    about: string;
    backgroundImageUrl: string;
    watermarkText: string;
    showWatermark: boolean;
    copyrightText: string;
    linksTitle: string;
    exploreTitle: string;
    blogTitle: string;
    showAbout: boolean;
    showSocials: boolean;
    showLinks: boolean;
    showExplore: boolean;
    showRecentBlog: boolean;
    showBottomBar: boolean;
    useSiteSocials: boolean;
    logoTone: string;
    isVisible: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    seoKeywords: string | null;
    canonicalUrl: string | null;
    ogImageUrl: string | null;
    twitterImageUrl: string | null;
    noIndex: boolean;
  },
  links: FooterNavLink[],
  recentBlog: FooterRecentPostItem[],
  socials: FooterSocialItem[],
): FooterContent {
  return {
    about: row.about,
    backgroundImageUrl: row.backgroundImageUrl,
    watermarkText: row.watermarkText,
    showWatermark: row.showWatermark,
    copyrightText: row.copyrightText,
    linksTitle: row.linksTitle,
    exploreTitle: row.exploreTitle,
    blogTitle: row.blogTitle,
    showAbout: row.showAbout,
    showSocials: row.showSocials,
    showLinks: row.showLinks,
    showExplore: row.showExplore,
    showRecentBlog: row.showRecentBlog,
    showBottomBar: row.showBottomBar,
    useSiteSocials: row.useSiteSocials,
    logoTone: row.logoTone === "light" ? "light" : "dark",
    isVisible: row.isVisible,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    seoKeywords: row.seoKeywords,
    canonicalUrl: row.canonicalUrl,
    ogImageUrl: row.ogImageUrl,
    twitterImageUrl: row.twitterImageUrl,
    noIndex: row.noIndex,
    linksColumnOne: links.filter((link) => link.column === "LINKS_ONE"),
    linksColumnTwo: links.filter((link) => link.column === "LINKS_TWO"),
    explore: links.filter((link) => link.column === "EXPLORE"),
    bottomLinks: links.filter((link) => link.column === "BOTTOM"),
    recentBlog,
    socials,
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
    marqueeSettings,
    marqueeItems,
    teamSettings,
    teamMembers,
    workingProcessSettings,
    workingProcessSteps,
    contactSettings,
    footerSettings,
    footerLinks,
    footerRecentPosts,
    footerSocials,
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
    prisma.marqueeSettings.findUnique({ where: { id: "default" } }),
    prisma.marqueeItem.findMany({
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
    prisma.contactSettings.findUnique({ where: { id: "default" } }),
    prisma.footerSettings.findUnique({ where: { id: "default" } }),
    prisma.footerLink.findMany({
      where: { deletedAt: null, isVisible: true, isActive: true },
      orderBy: [{ column: "asc" }, { displayOrder: "asc" }],
    }),
    prisma.footerRecentPost.findMany({
      where: { deletedAt: null, isVisible: true, isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.footerSocialLink.findMany({
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
    header: mapHeader(header),
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
    marquee: marqueeSettings
      ? mapMarqueeSettings(
          marqueeSettings,
          marqueeItems.length
            ? marqueeItems.map(mapMarqueeItem)
            : defaultMarquee.items,
        )
      : defaultMarquee,
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
    contact: contactSettings ? mapContactSection(contactSettings) : defaultContact,
    footer: (() => {
      if (!footerSettings) return defaultFooter;

      const mappedLinks = footerLinks.length
        ? footerLinks.map(mapFooterLink)
        : defaultFooterLinks;
      const mappedPosts = footerRecentPosts.length
        ? footerRecentPosts.map(mapFooterRecentPost)
        : defaultFooterRecentPosts.map((post, index) => ({
            id: `fallback-frp-${index}`,
            ...post,
          }));

      const siteSocialsAsFooter: FooterSocialItem[] = socialLinks
        .filter((link) => link.visible)
        .map((link, index) => ({
          id: link.id,
          label: link.label,
          href: link.href,
          icon: link.icon,
          displayOrder: link.sortOrder ?? index,
          isVisible: link.visible,
          isActive: true,
          deletedAt: null,
        }));

      const mappedSocials = footerSettings.useSiteSocials
        ? siteSocialsAsFooter.length
          ? siteSocialsAsFooter
          : defaultFooterSocials.map((social, index) => ({
              id: `fallback-fs-${index}`,
              ...social,
            }))
        : footerSocials.length
          ? footerSocials.map(mapFooterSocial)
          : defaultFooterSocials.map((social, index) => ({
              id: `fallback-fs-${index}`,
              ...social,
            }));

      return mapFooterContent(
        footerSettings,
        mappedLinks,
        mappedPosts,
        mappedSocials,
      );
    })(),
  };
});
