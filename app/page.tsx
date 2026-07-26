import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { PartnerMarquee } from "@/components/site/PartnerMarquee";
import { Features } from "@/components/site/Features";
import { About } from "@/components/site/About";
import { ClientLogos } from "@/components/site/ClientLogos";
import { Services } from "@/components/site/Services";
import { BookAppointment } from "@/components/site/BookAppointment";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { MarqueeBands } from "@/components/site/MarqueeBands";
import { Team } from "@/components/site/Team";
import { Projects } from "@/components/site/Projects";
import { WorkingProcess } from "@/components/site/WorkingProcess";
import { Blog } from "@/components/site/Blog";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { getSiteContent } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <div className="findox-scope page-wrapper">
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
        {/* <ClientLogos /> */}
        <Services services={content.services} />
        <BookAppointment bookAppointment={content.bookAppointment} />
        <WhyChooseUs whyChoose={content.whyChoose} />
        <MarqueeBands />
        <Team />
        <Projects />
        <WorkingProcess />
        <Blog />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
