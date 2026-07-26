export type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

/** Knowledge Bank dropdown destinations — all route through /insight?filter= */
export const KNOWLEDGE_BANK_CHILDREN: NavLink[] = [
  { label: "Insights", href: "/insight?filter=insights" },
  { label: "Shorts", href: "/insight?filter=shorts" },
  { label: "Calculators", href: "/insight?filter=calculators" },
  { label: "Updates", href: "/insight?filter=updates" },
  { label: "Utilities", href: "/insight?filter=utilities" },
  { label: "Links", href: "/insight?filter=links" },
  { label: "Acts & Rules", href: "/insight?filter=acts" },
  { label: "Forms", href: "/insight?filter=forms" },
];

export const MENU: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#" },
  {
    label: "Knowledge Bank",
    href: "/insight",
    children: KNOWLEDGE_BANK_CHILDREN,
  },
  { label: "Services", href: "#" },
  { label: "Contact", href: "#" },
];

export function withKnowledgeBankDropdown(
  items: Array<{ label: string; href: string }>,
): NavLink[] {
  return items.map((item) => {
    if (item.label.trim().toLowerCase() === "knowledge bank") {
      return {
        label: item.label,
        href: "/insight",
        children: KNOWLEDGE_BANK_CHILDREN,
      };
    }
    return { label: item.label, href: item.href };
  });
}

export const HOME_SHOWCASE = [
  { title: "Home Page 01", image: "/images/demo/hm.jpg", multi: "/", one: "#" },
] as const;

export const CONTACT = {
  email: "hello@carviassociates.com",
  address: "25/09 Mozilla Golden Street",
  phone: "+91 5698 0036 420",
  phoneHref: "tel:+9156980036420",
};

export const WHATSAPP_CHANNEL = {
  label: "WhatsApp Channel",
  href: "https://whatsapp.com/channel/0029VaExampleChannelId",
};

export const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", icon: "fa-facebook-f" },
  { label: "X", href: "https://x.com", icon: "fa-twitter" },
  { label: "Linkedin", href: "https://linkedin.com", icon: "fa-linkedin-in" },
  { label: "Instagram", href: "https://instagram.com", icon: "fa-instagram" },
];
