import type {
  AboutContent,
  FeatureItem,
  HeroStat,
  HeroTrustItem,
  PartnerMarqueeItem,
} from "@/lib/cms/types";

export const defaultNavItems = [
  { label: "Home", href: "/", sortOrder: 0, visible: true },
  { label: "About Us", href: "#", sortOrder: 1, visible: true },
  { label: "Knowledge Bank", href: "#", sortOrder: 2, visible: true },
  { label: "Services", href: "#", sortOrder: 3, visible: true },
  { label: "Contact", href: "#", sortOrder: 4, visible: true },
];

export const defaultSocialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: "fa-facebook-f", sortOrder: 0, visible: true },
  { label: "X", href: "https://x.com", icon: "fa-twitter", sortOrder: 1, visible: true },
  { label: "Linkedin", href: "https://linkedin.com", icon: "fa-linkedin-in", sortOrder: 2, visible: true },
  { label: "Instagram", href: "https://instagram.com", icon: "fa-instagram", sortOrder: 3, visible: true },
];

export const defaultTopbar = {
  email: "hello@carviassociates.com",
  address: "25/09 Mozilla Golden Street",
  addressMapUrl: "https://www.google.com/maps",
  phone: "+91 5698 0036 420",
  phoneHref: "tel:+9156980036420",
  whatsappLabel: "WhatsApp Channel",
  whatsappHref: "https://whatsapp.com/channel/0029VaExampleChannelId",
};

export const defaultHeroStats: HeroStat[] = [
  {
    icon: "icon-trophy",
    end: 24,
    suffix: "+",
    label: "Years Experience",
  },
  {
    icon: "icon-business-and-finance",
    end: 500,
    suffix: "+",
    label: "Businesses Served",
  },
  {
    icon: "icon-analytics",
    end: 50,
    suffix: "+",
    label: "Industries",
  },
  {
    icon: "icon-folder",
    end: 1000,
    suffix: "+",
    label: "Returns Filed",
  },
];

export const defaultHeroTrust: HeroTrustItem[] = [
  { icon: "icon-satisfaction", label: "Chartered Accountants" },
  { icon: "icon-analysis", label: "Audit · Tax · Compliance" },
  { icon: "icon-location", label: "Pan-India Advisory" },
];

export const defaultHero = {
  tagline: "YOUR GROWTH. OUR COMMITMENT.",
  titleBeforeVideo: "Helping Businesses",
  titleHighlight: "Grow",
  titleAfterVideo: "with Confidence",
  description:
    "Expertise in Audit, Tax, Compliance & Advisory to help you stay compliant, reduce risks and scale your business.",
  secondaryCtaText: "Talk to an Expert",
  ctaText: "Book Free Consultation",
  ctaHref: "#",
  videoId: null as string | null,
  heroImageUrl: "https://bracketweb.com/findox-laravel/assets/images/hero-slider/hero-1-1.png",
  activeUserCount: 125,
  activeUserSuffix: "k+",
  activeUserLabel: "Active Users",
  activeUserImages: [
    "/images/resources/active-user-1.jpg",
    "/images/resources/active-user-2.jpg",
    "/images/resources/active-user-3.jpg",
  ],
  stats: defaultHeroStats,
  trust: defaultHeroTrust,
};

export const defaultHeader = {
  contactCtaText: "Contact Us",
  contactCtaHref: "#",
};

export const defaultPartnerMarqueeLabel = "Trusted by Businesses Across India";

export const defaultPartners: Omit<PartnerMarqueeItem, "id">[] = [
  {
    name: "Vasavi",
    tagline: "The Future Is Here",
    logoUrl: null,
    variant: "stacked",
    sortOrder: 0,
    visible: true,
  },
  {
    name: "Sree Constructions",
    tagline: null,
    logoUrl: null,
    variant: "script",
    sortOrder: 1,
    visible: true,
  },
  {
    name: "Pranava",
    tagline: "Constructions",
    logoUrl: null,
    variant: "dual",
    sortOrder: 2,
    visible: true,
  },
  {
    name: "Medi Life",
    tagline: "Hospitals",
    logoUrl: null,
    variant: "dual",
    sortOrder: 3,
    visible: true,
  },
  {
    name: "UrbanBite",
    tagline: null,
    logoUrl: null,
    variant: "brand",
    sortOrder: 4,
    visible: true,
  },
  {
    name: "Shree",
    tagline: "Marbles",
    logoUrl: null,
    variant: "dual",
    sortOrder: 5,
    visible: true,
  },
];

export const defaultFeatures: Omit<FeatureItem, "id">[] = [
  {
    icon: "icon-risk",
    title: "Financial Growth",
    text: "Financial Revenue solution in business and enhancing.",
    href: "#",
    sortOrder: 0,
    visible: true,
  },
  {
    icon: "icon-financial-presentation",
    title: "Finance Planning",
    text: "Supporting individuals in business challenges, and.",
    href: "#",
    sortOrder: 1,
    visible: true,
  },
  {
    icon: "icon-approach",
    title: "Business Advisory",
    text: "Thanks for taking the time to make the website, but i.",
    href: "#",
    sortOrder: 2,
    visible: true,
  },
];

export const defaultAbout: AboutContent = {
  tagline: "Our About Company",
  title: ["We Provide Professional Advice", "About This Finance."],
  text: "Business tailored design, management & support services Business business agency elit, sed do eiusmod tempor majority have in some we form, by injected humour solution.",
  experience: { value: "37+", label: "Years Experience" },
  images: {
    collageOne: "/images/about/about-1-1.jpg",
    collageTwo: "/images/about/about-1-2.jpg",
  },
  collageOneAlt: "Advisors reviewing a financial plan",
  collageTwoAlt: "Client consultation in progress",
  defaultTabId: "team-support",
  taglineBg: "#f4ebd8",
  tabs: [
    { id: "data-analysis", label: "Data Analysis", image: "/images/about/about-1-3.jpg" },
    { id: "team-support", label: "Team Support", image: "/images/about/about-1-4.jpg" },
    { id: "advertising", label: "Advertising", image: "/images/about/about-1-5.jpg" },
  ],
  checklist: [
    "Experienced & Skilled Team.",
    "Financial Audit Business Files.",
    "Lending & Credit Services.",
  ],
};
