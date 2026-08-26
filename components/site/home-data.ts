/**
 * Dummy homepage content for Carvi Associates — mirrors the Findox reference
 * template's "Home One" copy/structure 1:1 (brand name swapped, filler copy
 * kept as-is). All internal links are "#" placeholders since only the home
 * page exists in this build.
 *
 * Hero, Partner Marquee, Features, About, Services, Book Appointment,
 * Why Choose Us, Marquee Bands, Team, and Working Process are
 * CMS-managed via Prisma (`lib/cms/*`).
 */

export const CLIENTS = {
  headline: ["Over 330+ Projects With 200+ Clients"],
  logo: "/images/resources/brand-1-1.png",
  logoHover: "/images/resources/brand-1-1-hover.png",
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
