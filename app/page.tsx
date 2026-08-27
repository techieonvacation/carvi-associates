import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { PartnerMarquee } from "@/components/site/PartnerMarquee";
import { Features } from "@/components/site/Features";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { BookAppointment } from "@/components/site/BookAppointment";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { MarqueeBands } from "@/components/site/MarqueeBands";
import { Team } from "@/components/site/Team";
import { WorkingProcess } from "@/components/site/WorkingProcess";
import { Blog } from "@/components/site/Blog";
import { FaqSection } from "@/components/site/FaqSection";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { PageJsonLd } from "@/components/seo/site-json-ld";
import { getSiteContent } from "@/lib/cms/queries";
import { getHomeBlog } from "@/lib/cms/blog-queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSeoFaqsForPath, getSeoSettings } from "@/lib/seo/queries";
import { buildServiceListNode } from "@/lib/seo/json-ld";
import { toAbsoluteUrl } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/" });
}

export default async function Home() {
  const [content, blog, settings, faqs] = await Promise.all([
    getSiteContent(),
    getHomeBlog(),
    getSeoSettings(),
    getSeoFaqsForPath("/"),
  ]);

  const homeUrl = toAbsoluteUrl(settings, "/");
  const serviceNode = buildServiceListNode(
    settings,
    homeUrl,
    content.services.items
      .filter((service) => service.isVisible)
      .slice(0, 12)
      .map((service) => ({
        name: service.shortTitle || `${service.titleLine1} ${service.titleLine2}`.trim(),
        description: service.description,
        url: service.ctaHref?.startsWith("/") ? service.ctaHref : "/#services",
      })),
  );

  return (
    <div className="findox-scope page-wrapper">
      <PageJsonLd
        path="/"
        breadcrumbs={[{ name: "Home", path: "/" }]}
        extraNodes={[serviceNode]}
      />
      <Header
        navItems={content.navItems}
        socialLinks={content.socialLinks}
        topbar={content.topbar}
        header={content.header}
      />
      <main>
        <Hero hero={content.hero} whatsappHref={content.topbar.whatsappHref} />
        <PartnerMarquee
          label={content.partnerMarquee.label}
          partners={content.partnerMarquee.partners}
        />
        <Features features={content.features} />
        <About about={content.about} />
        <Services services={content.services} />
        <BookAppointment bookAppointment={content.bookAppointment} />
        <WhyChooseUs whyChoose={content.whyChoose} />
        <MarqueeBands marquee={content.marquee} />
        <Team team={content.team} />
        <WorkingProcess workingProcess={content.workingProcess} />
        <Blog blog={blog} />
        <FaqSection faqs={faqs} />
        <ContactSection
          contact={content.contact}
          fallback={{
            phone: content.topbar.phone,
            phoneHref: content.topbar.phoneHref,
            email: content.topbar.email,
            address: content.topbar.address,
            addressMapUrl: content.topbar.addressMapUrl,
          }}
        />
      </main>
      <Footer footer={content.footer} logo={content.header.logo} />
    </div>
  );
}
