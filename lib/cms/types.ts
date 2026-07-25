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
