/**
 * Dummy homepage content for Carvi Associates — mirrors the Findox reference
 * template's "Home One" copy/structure 1:1 (brand name swapped, filler copy
 * kept as-is). All internal links are "#" placeholders since only the home
 * page exists in this build.
 *
 * Hero, Partner Marquee, Features, About, Services, Book Appointment,
 * Why Choose Us, Team, and Working Process are CMS-managed via Prisma (`lib/cms/*`).
 */

export const CLIENTS = {
  headline: ["Over 330+ Projects With 200+ Clients"],
  logo: "/images/resources/brand-1-1.png",
  logoHover: "/images/resources/brand-1-1-hover.png",
};

export const MARQUEE_WORDS = [
  "#Marketing",
  "#Financial",
  "#Support",
  "#Consulting",
  "#Strategy",
  "#Business",
  "#Corporate",
  "#Startup",
];

export const PROJECT_FILTERS = [
  { label: "All", value: "all" },
  { label: "Business", value: "business" },
  { label: "Counseling", value: "counseling" },
  { label: "Support", value: "support" },
  { label: "Financial", value: "financial" },
  { label: "Branding", value: "branding" },
];

export const PROJECTS = {
  tagline: "Our Case Studies",
  title: ["We Popular Projects Studies", "For Clients Case Study."],
  items: [
    {
      icon: "icon-business-and-finance",
      title: "Business Strategy",
      text: "Driving growth through planning",
      image: "/images/projects/project-1-1.jpg",
      category: "business",
      tags: ["Business", "Strategy"],
    },
    {
      icon: "icon-satisfaction",
      title: "Team Counseling",
      text: "Guiding teams with clarity",
      image: "/images/projects/project-1-2.jpg",
      category: "counseling",
      tags: ["Counseling", "Branding"],
    },
    {
      icon: "icon-support",
      title: "Client Support",
      text: "Building trust with service",
      image: "/images/projects/project-1-3.jpg",
      category: "support",
      tags: ["Design", "Support"],
    },
    {
      icon: "icon-analytics",
      title: "Financial Analysis",
      text: "Unlocking insights for success",
      image: "/images/projects/project-1-4.jpg",
      category: "financial",
      tags: ["Financial", "Analysis"],
    },
    {
      icon: "icon-technical-team",
      title: "Branding Solutions",
      text: "Creating identity that lasts",
      image: "/images/projects/project-1-5.jpg",
      category: "branding",
      tags: ["Branding", "Solutions"],
    },
    {
      icon: "icon-planning",
      title: "Digital of Marketing",
      text: "Financial services provided",
      image: "/images/projects/project-1-6.jpg",
      category: "financial",
      tags: ["Branding", "Branding"],
    },
  ],
  bottomBanner: {
    stat: "25,860+",
    title: ["Projects Completed Business Planning", "Online Service Solution."],
    checklist: ["Remind yourself Business know fact."],
    button: "View All Projects",
  },
};

export const BLOG = {
  tagline: "Our Latest Blog",
  title: ["Today's Blog Industry Finance", "Business Consulting."],
  posts: [
    {
      title: "Why Business Startups Need Strong Cash Flow.",
      author: "Judith white",
      date: "25, June, 2025",
      image: "/images/blog/blog-1-1.jpg",
      avatar: "/images/blog/blog-admin-1-1.png",
    },
    {
      title: "How Consulting Firms Support Client Growth.",
      author: "Linda Clark",
      date: "25, June, 2025",
      image: "/images/blog/blog-1-2.jpg",
      avatar: "/images/blog/blog-admin-1-2.png",
    },
    {
      title: "Smart Ideas For Long-Term Business Success.",
      author: "Jhone Doe",
      date: "25, June, 2025",
      image: "/images/blog/blog-1-3.jpg",
      avatar: "/images/blog/blog-admin-1-3.png",
    },
  ],
};

export const NEWSLETTER = {
  title: "Subscribe Your Newsletter",
  text: "We have built dictumst sollicitudin cu sociis libero lacus cubilia leo porta penatibus varius arcu sagittis in the consumer goods business.",
};
