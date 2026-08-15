import { z } from "zod";
import {
  FOOTER_LINK_COLUMNS,
  IMAGE_FIT_OPTIONS,
  MARQUEE_BAND_TARGETS,
  MARQUEE_DIRECTIONS,
  MARQUEE_ITEM_KINDS,
  MARQUEE_LAYOUTS,
  PARTNER_VARIANTS,
  PROJECT_TAG_TONES,
  SERVICE_ICON_TYPES,
} from "@/lib/cms/types";

export const heroStatSchema = z.object({
  icon: z.string().min(1),
  end: z.number().int().min(0),
  suffix: z.string(),
  label: z.string().min(1),
});

export const heroTrustSchema = z.object({
  icon: z.string().min(1),
  label: z.string().min(1),
});

export const heroSchema = z.object({
  tagline: z.string().min(1),
  titleBeforeVideo: z.string().min(1),
  titleHighlight: z.string().min(1),
  titleAfterVideo: z.string().min(1),
  description: z.string().min(1),
  secondaryCtaText: z.string().min(1),
  ctaText: z.string().min(1),
  ctaHref: z.string().min(1),
  videoId: z.string().optional().nullable(),
  heroImageUrl: z.string().min(1),
  activeUserCount: z.number().int().min(0),
  activeUserSuffix: z.string().min(1),
  activeUserLabel: z.string().min(1),
  activeUserImages: z.array(z.string().min(1)),
  stats: z.array(heroStatSchema),
  trust: z.array(heroTrustSchema),
});

export const partnerItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  tagline: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  variant: z.enum(PARTNER_VARIANTS),
  sortOrder: z.number().int(),
  visible: z.boolean(),
});

export const partnersPayloadSchema = z.object({
  label: z.string().min(1),
  partners: z.array(partnerItemSchema),
});

export const featureItemSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  href: z.string().min(1),
  sortOrder: z.number().int(),
  visible: z.boolean(),
});

export const featuresPayloadSchema = z.object({
  features: z.array(featureItemSchema).min(1),
});

export const aboutTabSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug id"),
  label: z.string().min(1),
  image: z.string().min(1),
});

export const aboutSchema = z.object({
  tagline: z.string().min(1),
  titleLine1: z.string().min(1),
  titleLine2: z.string().min(1),
  text: z.string().min(1),
  experienceValue: z.string().min(1),
  experienceLabel: z.string().min(1),
  collageOneUrl: z.string().min(1),
  collageTwoUrl: z.string().min(1),
  collageOneAlt: z.string().min(1),
  collageTwoAlt: z.string().min(1),
  defaultTabId: z.string().optional().nullable(),
  taglineBg: z.string().min(1),
  tabs: z.array(aboutTabSchema).min(1),
  checklist: z.array(z.string().min(1)).min(1),
});

const optionalUrl = z.string().optional().nullable();
const optionalText = z.string().optional().nullable();

export const servicesSectionSchema = z.object({
  tagline: z.string().min(1),
  titleLine1: z.string().min(1),
  titleLine2: z.string().min(1),
  cardTagline: z.string().min(1),
  taglineBg: z.string().min(1),
  isVisible: z.boolean(),
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  canonicalUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  twitterImageUrl: optionalUrl,
  noIndex: z.boolean(),
});

export const serviceItemSchema = z.object({
  titleLine1: z.string().min(1),
  titleLine2: z.string().min(1),
  shortTitle: optionalText,
  subtitle: optionalText,
  description: z.string().min(1),
  slug: z
    .union([
      z.literal(""),
      z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug"),
      z.null(),
    ])
    .optional(),
  icon: z.string().min(1),
  iconType: z.enum(SERVICE_ICON_TYPES),
  imageUrl: z.string().min(1),
  imageAlt: z.string(),
  hoverImageUrl: optionalUrl,
  badge: optionalText,
  category: optionalText,
  serviceType: optionalText,
  accentColor: optionalText,
  ctaText: z.string().min(1),
  ctaHref: z.string().min(1),
  displayOrder: z.number().int().optional(),
  isFeatured: z.boolean(),
  isPopular: z.boolean(),
  isActive: z.boolean(),
  isVisible: z.boolean(),
  publishedAt: z.union([z.string().datetime(), z.literal(""), z.null()]).optional(),
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  canonicalUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  noIndex: z.boolean(),
});

export const servicesReorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

export const servicesBulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  action: z.enum([
    "publish",
    "unpublish",
    "hide",
    "show",
    "activate",
    "deactivate",
    "soft-delete",
    "restore",
    "hard-delete",
    "duplicate",
  ]),
});

export const bookAppointmentSchema = z.object({
  tagline: z.string().min(1),
  titleLine1: z.string().min(1),
  titleLine2: z.string().min(1),
  description: z.string().min(1),
  primaryButtonText: z.string().min(1),
  primaryButtonHref: z.string().min(1),
  secondaryButtonText: z.string().min(1),
  secondaryButtonHref: z.string().min(1),
  backgroundImageUrl: z.string().min(1),
  backgroundImageAlt: z.string(),
  taglineBg: z.string().min(1),
  isVisible: z.boolean(),
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  canonicalUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  twitterImageUrl: optionalUrl,
  noIndex: z.boolean(),
});

export const whyChooseSectionSchema = z.object({
  tagline: z.string().min(1),
  titleLine1: z.string().min(1),
  titleLine2: z.string().min(1),
  description: z.string().min(1),
  taglineBg: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string().min(1),
  shapeImageUrl: z.string().min(1),
  imageFit: z.enum(IMAGE_FIT_OPTIONS),
  imageMinHeightPx: z.number().int().min(240).max(1200),
  showImageShape: z.boolean(),
  isVisible: z.boolean(),
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  canonicalUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  twitterImageUrl: optionalUrl,
  noIndex: z.boolean(),
});

export const whyChooseItemSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  href: z.string().min(1),
  displayOrder: z.number().int().optional(),
  isVisible: z.boolean(),
  isActive: z.boolean(),
});

export const whyChooseItemsPayloadSchema = z.object({
  items: z.array(whyChooseItemSchema).min(1),
});

export const whyChooseReorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

export const whyChooseBulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  action: z.enum([
    "show",
    "hide",
    "activate",
    "deactivate",
    "soft-delete",
    "restore",
    "hard-delete",
    "duplicate",
  ]),
});

export const teamSectionSchema = z.object({
  tagline: z.string().min(1),
  titleLine1: z.string().min(1),
  titleLine2: z.string().min(1),
  taglineBg: z.string().min(1),
  isVisible: z.boolean(),
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  canonicalUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  twitterImageUrl: optionalUrl,
  noIndex: z.boolean(),
});

export const teamMemberSocialSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().min(1),
});

export const teamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  role: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string(),
  href: z.string().min(1),
  socials: z.array(teamMemberSocialSchema).default([]),
  displayOrder: z.number().int().optional(),
  isVisible: z.boolean(),
  isActive: z.boolean(),
});

export const teamMembersPayloadSchema = z.object({
  members: z.array(teamMemberSchema).min(1),
});

export const workingProcessSectionSchema = z.object({
  tagline: z.string().min(1),
  titleLine1: z.string().min(1),
  titleLine2: z.string().min(1),
  taglineBg: z.string().min(1),
  isVisible: z.boolean(),
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  canonicalUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  twitterImageUrl: optionalUrl,
  noIndex: z.boolean(),
});

export const workingProcessStepSchema = z.object({
  id: z.string().optional(),
  stepLabel: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string(),
  href: z.string().min(1),
  displayOrder: z.number().int().optional(),
  isVisible: z.boolean(),
  isActive: z.boolean(),
});

export const workingProcessStepsPayloadSchema = z.object({
  steps: z.array(workingProcessStepSchema).min(1),
});

export const footerSectionSchema = z.object({
  about: z.string().min(1),
  backgroundImageUrl: z.string().min(1),
  watermarkText: z.string().min(1),
  showWatermark: z.boolean(),
  copyrightText: z.string().min(1),
  linksTitle: z.string().min(1),
  exploreTitle: z.string().min(1),
  blogTitle: z.string().min(1),
  showAbout: z.boolean(),
  showSocials: z.boolean(),
  showLinks: z.boolean(),
  showExplore: z.boolean(),
  showRecentBlog: z.boolean(),
  showBottomBar: z.boolean(),
  useSiteSocials: z.boolean(),
  logoTone: z.enum(["light", "dark"]),
  isVisible: z.boolean(),
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  canonicalUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  twitterImageUrl: optionalUrl,
  noIndex: z.boolean(),
});

export const footerLinkSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  href: z.string().min(1),
  column: z.enum(FOOTER_LINK_COLUMNS),
  displayOrder: z.number().int().optional(),
  isVisible: z.boolean(),
  isActive: z.boolean(),
});

export const footerLinksPayloadSchema = z.object({
  links: z.array(footerLinkSchema),
});

export const footerRecentPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  dateLabel: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string(),
  href: z.string().min(1),
  displayOrder: z.number().int().optional(),
  isVisible: z.boolean(),
  isActive: z.boolean(),
});

export const footerRecentPostsPayloadSchema = z.object({
  posts: z.array(footerRecentPostSchema),
});

export const footerSocialSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().min(1),
  displayOrder: z.number().int().optional(),
  isVisible: z.boolean(),
  isActive: z.boolean(),
});

export const footerSocialsPayloadSchema = z.object({
  socials: z.array(footerSocialSchema),
});

const hexColor = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Use a hex colour");

export const marqueeSettingsSchema = z.object({
  ariaLabel: z.string().min(1),
  layout: z.enum(MARQUEE_LAYOUTS),
  isVisible: z.boolean(),
  showBandOne: z.boolean(),
  showBandTwo: z.boolean(),
  bandOneBgColor: hexColor,
  bandOneTextColor: hexColor,
  bandTwoBgColor: hexColor,
  bandTwoTextColor: hexColor,
  bandOneDirection: z.enum(MARQUEE_DIRECTIONS),
  bandTwoDirection: z.enum(MARQUEE_DIRECTIONS),
  bandOneSpeedSeconds: z.number().int().min(5).max(180),
  bandTwoSpeedSeconds: z.number().int().min(5).max(180),
  bandOneSeparatorUrl: z.string().min(1),
  bandTwoSeparatorUrl: z.string().min(1),
  showSeparator: z.boolean(),
  skewDegrees: z.number().min(0).max(20),
  fontSizePx: z.number().int().min(12).max(96),
  itemGapPx: z.number().int().min(4).max(120),
  bandPaddingPx: z.number().int().min(0).max(120),
  alternateOutline: z.boolean(),
  pauseOnHover: z.boolean(),
});

export const marqueeItemSchema = z
  .object({
    id: z.string().optional(),
    kind: z.enum(MARQUEE_ITEM_KINDS),
    band: z.enum(MARQUEE_BAND_TARGETS),
    text: z.string(),
    imageUrl: optionalUrl,
    imageAlt: z.string(),
    imageWidth: z.number().int().min(8).max(1200),
    imageHeight: z.number().int().min(8).max(400),
    href: optionalUrl,
    outlined: z.boolean(),
    displayOrder: z.number().int().optional(),
    isVisible: z.boolean(),
    isActive: z.boolean(),
  })
  .refine((item) => item.kind === "IMAGE" || item.text.trim().length > 0, {
    message: "Text is required for text items",
    path: ["text"],
  })
  .refine(
    (item) => item.kind === "TEXT" || Boolean(item.imageUrl && item.imageUrl.trim().length),
    { message: "Image is required for image items", path: ["imageUrl"] },
  );

export const marqueeItemsPayloadSchema = z.object({
  items: z.array(marqueeItemSchema),
});

export const marqueeReorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

export const marqueeBulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  action: z.enum([
    "show",
    "hide",
    "activate",
    "deactivate",
    "soft-delete",
    "restore",
    "hard-delete",
    "duplicate",
  ]),
});

export const projectsSectionSchema = z.object({
  tagline: z.string().min(1),
  titleLine1: z.string().min(1),
  titleLine2: z.string().min(1),
  taglineBg: z.string().min(1),
  topBackgroundImageUrl: z.string().min(1),
  bottomBackgroundImageUrl: z.string().min(1),
  showFilters: z.boolean(),
  allFilterLabel: z.string().min(1),
  showBottomBanner: z.boolean(),
  bannerStat: z.string().min(1),
  bannerTitleLine1: z.string().min(1),
  bannerTitleLine2: z.string().min(1),
  bannerChecklist: z.array(z.string().min(1)),
  bannerButtonText: z.string().min(1),
  bannerButtonHref: z.string().min(1),
  isVisible: z.boolean(),
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  canonicalUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  twitterImageUrl: optionalUrl,
  noIndex: z.boolean(),
});

export const projectCategorySchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug"),
  displayOrder: z.number().int().optional(),
  isVisible: z.boolean(),
  isActive: z.boolean(),
});

export const projectCategoriesPayloadSchema = z.object({
  categories: z.array(projectCategorySchema),
});

export const projectTagSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  tone: z.enum(PROJECT_TAG_TONES),
});

export const projectItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  text: z.string().min(1),
  icon: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string(),
  href: z.string().min(1),
  slug: z
    .union([
      z.literal(""),
      z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug"),
      z.null(),
    ])
    .optional(),
  categorySlug: optionalText,
  tags: z.array(projectTagSchema).max(4),
  displayOrder: z.number().int().optional(),
  isFeatured: z.boolean(),
  isVisible: z.boolean(),
  isActive: z.boolean(),
});

export const projectItemsPayloadSchema = z.object({
  items: z.array(projectItemSchema),
});

export const projectsReorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

export const projectsBulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  action: z.enum([
    "show",
    "hide",
    "activate",
    "deactivate",
    "feature",
    "unfeature",
    "soft-delete",
    "restore",
    "hard-delete",
    "duplicate",
  ]),
});

/** Blog validators live in their own module — re-exported for a single import path. */
export * from "@/lib/cms/blog-schemas";
