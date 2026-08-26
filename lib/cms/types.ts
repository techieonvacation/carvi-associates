export const LOGO_VARIANTS = ["wordmark", "image"] as const;

export const SOCIAL_ICON_OPTIONS = [
  { value: "fa-facebook-f", label: "Facebook" },
  { value: "fa-twitter", label: "X" },
  { value: "fa-linkedin-in", label: "LinkedIn" },
  { value: "fa-instagram", label: "Instagram" },
  { value: "fa-whatsapp", label: "WhatsApp" },
] as const;

export type LogoVariant = (typeof LOGO_VARIANTS)[number];

export type SiteLogo = {
  variant: LogoVariant;
  imageUrl: string;
  darkImageUrl: string;
  alt: string;
  href: string;
  markText: string;
  primaryText: string;
  secondaryText: string;
  showMark: boolean;
  heightDesktop: number;
  heightMobile: number;
  textSizePx: number;
};

export type HeaderContent = {
  contactCtaText: string;
  contactCtaHref: string;
  showContactCta: boolean;
  showSearch: boolean;
  callTitle: string;
  showCall: boolean;
  showSidebar: boolean;
  sidebarAbout: string;
  sidebarContactTitle: string;
  sidebarNewsletterTitle: string;
  showSidebarNewsletter: boolean;
  logo: SiteLogo;
};

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

export type WhyChooseItem = {
  id: string;
  icon: string;
  title: string;
  text: string;
  href: string;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export const IMAGE_FIT_OPTIONS = ["cover", "contain"] as const;
export type ImageFit = (typeof IMAGE_FIT_OPTIONS)[number];

export type WhyChooseContent = {
  tagline: string;
  title: [string, string];
  description: string;
  taglineBg: string;
  imageUrl: string;
  imageAlt: string;
  shapeImageUrl: string;
  imageFit: ImageFit;
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
  items: WhyChooseItem[];
};

export type TeamMemberSocial = {
  label: string;
  href: string;
  icon: string;
};

export type TeamMemberItem = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  socials: TeamMemberSocial[];
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TeamContent = {
  tagline: string;
  title: [string, string];
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
  members: TeamMemberItem[];
};

export type WorkingProcessStepItem = {
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
  deletedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type WorkingProcessContent = {
  tagline: string;
  title: [string, string];
  taglineBg: string;
  isVisible: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  twitterImageUrl: string | null;
  noIndex: boolean;
  steps: WorkingProcessStepItem[];
};

export const MARQUEE_BAND_TARGETS = ["ONE", "TWO", "BOTH"] as const;
export type MarqueeBandTarget = (typeof MARQUEE_BAND_TARGETS)[number];

export const MARQUEE_ITEM_KINDS = ["TEXT", "IMAGE", "TEXT_IMAGE"] as const;
export type MarqueeItemKind = (typeof MARQUEE_ITEM_KINDS)[number];

export const MARQUEE_DIRECTIONS = ["left", "right"] as const;
export type MarqueeDirection = (typeof MARQUEE_DIRECTIONS)[number];

export const MARQUEE_LAYOUTS = ["stacked", "crossed"] as const;
export type MarqueeLayout = (typeof MARQUEE_LAYOUTS)[number];

export type MarqueeItemData = {
  id: string;
  kind: MarqueeItemKind;
  band: MarqueeBandTarget;
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
  deletedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type MarqueeContent = {
  ariaLabel: string;
  layout: MarqueeLayout;
  isVisible: boolean;
  showBandOne: boolean;
  showBandTwo: boolean;
  bandOneBgColor: string;
  bandOneTextColor: string;
  bandTwoBgColor: string;
  bandTwoTextColor: string;
  bandOneDirection: MarqueeDirection;
  bandTwoDirection: MarqueeDirection;
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
  items: MarqueeItemData[];
};

export const FOOTER_LINK_COLUMNS = [
  "LINKS_ONE",
  "LINKS_TWO",
  "EXPLORE",
  "BOTTOM",
] as const;

export type FooterLinkColumn = (typeof FOOTER_LINK_COLUMNS)[number];

export type FooterNavLink = {
  id: string;
  label: string;
  href: string;
  column: FooterLinkColumn;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: string | null;
};

export type FooterRecentPostItem = {
  id: string;
  title: string;
  dateLabel: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: string | null;
};

export type FooterSocialItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: string | null;
};

export type ContactContent = {
  tagline: string;
  title: [string, string];
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
};

export type FooterContent = {
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
  logoTone: "light" | "dark";
  isVisible: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  twitterImageUrl: string | null;
  noIndex: boolean;
  linksColumnOne: FooterNavLink[];
  linksColumnTwo: FooterNavLink[];
  explore: FooterNavLink[];
  bottomLinks: FooterNavLink[];
  recentBlog: FooterRecentPostItem[];
  socials: FooterSocialItem[];
};

/**
 * Blog domain types live in their own module (the surface is large: blocks,
 * FAQs, sources, comments, archive filters) and are re-exported here so every
 * CMS consumer keeps importing from a single `@/lib/cms/types` path.
 */
export * from "@/lib/cms/blog-types";
