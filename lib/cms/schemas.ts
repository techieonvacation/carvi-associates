import { z } from "zod";
import { PARTNER_VARIANTS } from "@/lib/cms/types";

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
