import { SERVICE_ICON_TYPES, type ServiceIconType, type ServiceItem } from "@/lib/cms/types";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseIconType(value: unknown): ServiceIconType {
  if (
    typeof value === "string" &&
    (SERVICE_ICON_TYPES as readonly string[]).includes(value)
  ) {
    return value as ServiceIconType;
  }
  return "icomoon";
}

export function normalizeNullable(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function mapServiceRow(row: {
  id: string;
  titleLine1: string;
  titleLine2: string;
  shortTitle: string | null;
  subtitle: string | null;
  description: string;
  slug: string | null;
  icon: string;
  iconType: string;
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
  publishedAt: Date | null;
  deletedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  noIndex: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ServiceItem {
  return {
    id: row.id,
    titleLine1: row.titleLine1,
    titleLine2: row.titleLine2,
    shortTitle: row.shortTitle,
    subtitle: row.subtitle,
    description: row.description,
    slug: row.slug,
    icon: row.icon,
    iconType: parseIconType(row.iconType),
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    hoverImageUrl: row.hoverImageUrl,
    badge: row.badge,
    category: row.category,
    serviceType: row.serviceType,
    accentColor: row.accentColor,
    ctaText: row.ctaText,
    ctaHref: row.ctaHref,
    displayOrder: row.displayOrder,
    isFeatured: row.isFeatured,
    isPopular: row.isPopular,
    isActive: row.isActive,
    isVisible: row.isVisible,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    seoKeywords: row.seoKeywords,
    canonicalUrl: row.canonicalUrl,
    ogImageUrl: row.ogImageUrl,
    noIndex: row.noIndex,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function serviceWriteData(
  data: {
    titleLine1: string;
    titleLine2: string;
    shortTitle?: string | null;
    subtitle?: string | null;
    description: string;
    slug?: string | null;
    icon: string;
    iconType: ServiceIconType;
    imageUrl: string;
    imageAlt: string;
    hoverImageUrl?: string | null;
    badge?: string | null;
    category?: string | null;
    serviceType?: string | null;
    accentColor?: string | null;
    ctaText: string;
    ctaHref: string;
    displayOrder?: number;
    isFeatured: boolean;
    isPopular: boolean;
    isActive: boolean;
    isVisible: boolean;
    publishedAt?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string | null;
    canonicalUrl?: string | null;
    ogImageUrl?: string | null;
    noIndex: boolean;
  },
  displayOrder: number,
) {
  const generatedSlug = slugify(`${data.titleLine1} ${data.titleLine2}`);
  const slugSource = normalizeNullable(data.slug) ?? (generatedSlug || null);

  return {
    titleLine1: data.titleLine1.trim(),
    titleLine2: data.titleLine2.trim(),
    shortTitle: normalizeNullable(data.shortTitle),
    subtitle: normalizeNullable(data.subtitle),
    description: data.description.trim(),
    slug: slugSource,
    icon: data.icon.trim(),
    iconType: data.iconType,
    imageUrl: data.imageUrl.trim(),
    imageAlt: data.imageAlt.trim(),
    hoverImageUrl: normalizeNullable(data.hoverImageUrl),
    badge: normalizeNullable(data.badge),
    category: normalizeNullable(data.category),
    serviceType: normalizeNullable(data.serviceType),
    accentColor: normalizeNullable(data.accentColor),
    ctaText: data.ctaText.trim() || "Learn more",
    ctaHref: data.ctaHref.trim() || "#",
    displayOrder,
    isFeatured: data.isFeatured,
    isPopular: data.isPopular,
    isActive: data.isActive,
    isVisible: data.isVisible,
    publishedAt:
      data.isActive && data.isVisible
        ? data.publishedAt
          ? new Date(data.publishedAt)
          : new Date()
        : data.publishedAt
          ? new Date(data.publishedAt)
          : null,
    seoTitle: normalizeNullable(data.seoTitle),
    seoDescription: normalizeNullable(data.seoDescription),
    seoKeywords: normalizeNullable(data.seoKeywords),
    canonicalUrl: normalizeNullable(data.canonicalUrl),
    ogImageUrl: normalizeNullable(data.ogImageUrl),
    noIndex: data.noIndex,
  };
}
