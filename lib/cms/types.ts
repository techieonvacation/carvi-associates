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
