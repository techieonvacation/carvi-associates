/**
 * Navigation model for the Carvi Associates marketing header.
 * Mirrors the Findox reference menu structure (Home megamenu + dropdowns).
 * All routes are placeholders ("#") since only the home page exists.
 */

export type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

export const MENU: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "#" },
  {
    label: "Pages",
    href: "#",
    children: [
      {
        label: "Our Projects",
        href: "#",
        children: [
          { label: "Our Projects", href: "#" },
          { label: "Projects Carousel", href: "#" },
          { label: "Project Details", href: "#" },
        ],
      },
      {
        label: "Our Team",
        href: "#",
        children: [
          { label: "Our Team 01", href: "#" },
          { label: "Our Team 02", href: "#" },
          { label: "Team Carousel 01", href: "#" },
          { label: "Team Carousel 02", href: "#" },
          { label: "Team Details", href: "#" },
        ],
      },
      {
        label: "Gallery",
        href: "#",
        children: [
          { label: "Gallery masonry", href: "#" },
          { label: "Gallery filter", href: "#" },
          { label: "Gallery Grid", href: "#" },
          { label: "Gallery Carousel", href: "#" },
        ],
      },
      { label: "Pricing Plan", href: "#" },
      { label: "FAQS", href: "#" },
      { label: "404 Error", href: "#" },
    ],
  },
  {
    label: "Services",
    href: "#",
    children: [
      {
        label: "Services grid",
        href: "#",
        children: [
          { label: "Services 01", href: "#" },
          { label: "Services 02", href: "#" },
        ],
      },
      {
        label: "Services Carousel",
        href: "#",
        children: [
          { label: "Services Carousel 01", href: "#" },
          { label: "Services Carousel 02", href: "#" },
        ],
      },
      { label: "Business Analytics", href: "#" },
      { label: "Finance Services", href: "#" },
      { label: "Business Accounts", href: "#" },
      { label: "Data Solutions", href: "#" },
      { label: "Finance Planning", href: "#" },
      { label: "Support Services", href: "#" },
    ],
  },
  {
    label: "Shop",
    href: "#",
    children: [
      {
        label: "Products",
        href: "#",
        children: [
          { label: "No sidebar", href: "#" },
          { label: "Left sidebar", href: "#" },
          { label: "Right sidebar", href: "#" },
        ],
      },
      { label: "Products carousel", href: "#" },
      { label: "Product details", href: "#" },
      { label: "Cart", href: "#" },
      { label: "Checkout", href: "#" },
    ],
  },
  {
    label: "Blog",
    href: "#",
    children: [
      {
        label: "Blog grid 01",
        href: "#",
        children: [
          { label: "No sidebar", href: "#" },
          { label: "Left sidebar", href: "#" },
          { label: "Right sidebar", href: "#" },
        ],
      },
      {
        label: "Blog grid 02",
        href: "#",
        children: [
          { label: "No sidebar", href: "#" },
          { label: "Left sidebar", href: "#" },
          { label: "Right sidebar", href: "#" },
        ],
      },
      {
        label: "Blog grid 03",
        href: "#",
        children: [
          { label: "No sidebar", href: "#" },
          { label: "Left sidebar", href: "#" },
          { label: "Right sidebar", href: "#" },
        ],
      },
      {
        label: "Blog list",
        href: "#",
        children: [
          { label: "No sidebar", href: "#" },
          { label: "Left sidebar", href: "#" },
          { label: "Right sidebar", href: "#" },
        ],
      },
      {
        label: "Blog carousel",
        href: "#",
        children: [
          { label: "Blog carousel 01", href: "#" },
          { label: "Blog carousel 02", href: "#" },
          { label: "Blog carousel 03", href: "#" },
        ],
      },
      {
        label: "Blog details",
        href: "#",
        children: [
          { label: "No sidebar", href: "#" },
          { label: "Left sidebar", href: "#" },
          { label: "Right sidebar", href: "#" },
        ],
      },
    ],
  },
  { label: "Contact", href: "#" },
];

export const HOME_SHOWCASE = [
   { title: "Home Page 01", image: "/images/demo/hm.jpg", multi: "/", one: "#" },
] as const;

export const CONTACT = {
  email: "hello@carviassociates.com",
  address: "25/09 Mozilla Golden Street",
  phone: "+91 5698 0036 420",
  phoneHref: "tel:+9156980036420",
};

export const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", icon: "fa-facebook-f" },
  { label: "X", href: "https://x.com", icon: "fa-twitter" },
  { label: "Linkedin", href: "https://linkedin.com", icon: "fa-linkedin-in" },
  { label: "Instagram", href: "https://instagram.com", icon: "fa-instagram" },
];
