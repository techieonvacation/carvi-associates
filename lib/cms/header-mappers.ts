import { defaultHeader, defaultLogo } from "@/lib/cms/defaults";
import { LOGO_VARIANTS, type HeaderContent, type LogoVariant, type SiteLogo } from "@/lib/cms/types";

export const LOGO_MIN_HEIGHT = 20;
export const LOGO_MAX_HEIGHT = 120;

export type HeaderRow = {
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
  logoVariant: string;
  logoImageUrl: string;
  logoDarkImageUrl: string;
  logoAlt: string;
  logoHref: string;
  logoMarkText: string;
  logoPrimaryText: string;
  logoSecondaryText: string;
  showLogoMark: boolean;
  logoHeightDesktop: number;
  logoHeightMobile: number;
};

export function normalizeLogoVariant(value: string): LogoVariant {
  return (LOGO_VARIANTS as readonly string[]).includes(value)
    ? (value as LogoVariant)
    : defaultLogo.variant;
}

export function clampLogoHeight(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(LOGO_MAX_HEIGHT, Math.max(LOGO_MIN_HEIGHT, Math.round(value)));
}

export function mapSiteLogo(row: HeaderRow): SiteLogo {
  const variant = normalizeLogoVariant(row.logoVariant);
  const imageUrl = row.logoImageUrl.trim();

  return {
    variant: variant === "image" && !imageUrl ? "wordmark" : variant,
    imageUrl,
    darkImageUrl: row.logoDarkImageUrl.trim(),
    alt: row.logoAlt.trim() || defaultLogo.alt,
    href: row.logoHref.trim() || defaultLogo.href,
    markText: row.logoMarkText.trim().slice(0, 2) || defaultLogo.markText,
    primaryText: row.logoPrimaryText.trim() || defaultLogo.primaryText,
    secondaryText: row.logoSecondaryText.trim(),
    showMark: row.showLogoMark,
    heightDesktop: clampLogoHeight(row.logoHeightDesktop, defaultLogo.heightDesktop),
    heightMobile: clampLogoHeight(row.logoHeightMobile, defaultLogo.heightMobile),
  };
}

export function mapHeader(row: HeaderRow | null): HeaderContent {
  if (!row) return defaultHeader;

  return {
    contactCtaText: row.contactCtaText,
    contactCtaHref: row.contactCtaHref,
    showContactCta: row.showContactCta,
    showSearch: row.showSearch,
    callTitle: row.callTitle.trim() || defaultHeader.callTitle,
    showCall: row.showCall,
    showSidebar: row.showSidebar,
    sidebarAbout: row.sidebarAbout.trim(),
    sidebarContactTitle: row.sidebarContactTitle.trim() || defaultHeader.sidebarContactTitle,
    sidebarNewsletterTitle:
      row.sidebarNewsletterTitle.trim() || defaultHeader.sidebarNewsletterTitle,
    showSidebarNewsletter: row.showSidebarNewsletter,
    logo: mapSiteLogo(row),
  };
}
