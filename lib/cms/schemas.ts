import { z } from "zod";
import { PARTNER_VARIANTS, SERVICE_ICON_TYPES } from "@/lib/cms/types";

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
