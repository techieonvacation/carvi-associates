export type HeroStat = {
  icon: string;
  end: number;
  suffix: string;
  label: string;
};

export type HeroTrustItem = {
  icon: string;
  label: string;
};

export const PARTNER_VARIANTS = [
  "default",
  "stacked",
  "script",
  "dual",
  "brand",
] as const;

export type PartnerVariant = (typeof PARTNER_VARIANTS)[number];

export type PartnerMarqueeItem = {
  id?: string;
  name: string;
  tagline?: string | null;
  logoUrl?: string | null;
  variant: PartnerVariant;
  sortOrder: number;
  visible: boolean;
};

export type FeatureItem = {
  id?: string;
  icon: string;
  title: string;
  text: string;
  href: string;
  sortOrder: number;
  visible: boolean;
};

export type AboutTab = {
  id: string;
  label: string;
  image: string;
};

export type AboutContent = {
  tagline: string;
  title: [string, string];
  text: string;
  experience: {
    value: string;
    label: string;
  };
  images: {
    collageOne: string;
    collageTwo: string;
  };
  collageOneAlt: string;
  collageTwoAlt: string;
  defaultTabId: string | null;
  taglineBg: string;
  tabs: AboutTab[];
  checklist: string[];
};

/** Curated icomoon classes commonly used across the site. */
export const FEATURE_ICON_OPTIONS = [
  "icon-risk",
  "icon-financial-presentation",
  "icon-approach",
  "icon-stats-2",
  "icon-agreement",
  "icon-bank",
  "icon-analysis",
  "icon-planning",
  "icon-support",
  "icon-market-research",
  "icon-data-visualization",
  "icon-advertisig-agency",
  "icon-trophy",
  "icon-business-and-finance",
  "icon-analytics",
  "icon-folder",
  "icon-satisfaction",
] as const;

export const SERVICE_ICON_TYPES = ["icomoon", "lucide", "image", "svg"] as const;
export type ServiceIconType = (typeof SERVICE_ICON_TYPES)[number];

export type ServicesSectionContent = {
  tagline: string;
  title: [string, string];
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
};

export type ServiceItem = {
  id: string;
  titleLine1: string;
  titleLine2: string;
  shortTitle: string | null;
  subtitle: string | null;
  description: string;
  slug: string | null;
  icon: string;
  iconType: ServiceIconType;
  imageUrl: string;
  imageAlt: string;
  hoverImageUrl: string | null;
  badge: string | null;
  category: string | null;
  serviceType: string | null;
  accentColor: string | null;
  ctaText: string;
  ctaHref: string;
  displayOrder: number;
  isFeatured: boolean;
  isPopular: boolean;
  isActive: boolean;
  isVisible: boolean;
  publishedAt: string | null;
  deletedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  noIndex: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ServicesContent = {
  section: ServicesSectionContent;
  items: ServiceItem[];
};

export type BookAppointmentContent = {
  tagline: string;
  title: [string, string];
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
};
