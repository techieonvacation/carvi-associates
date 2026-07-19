import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
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

export default function Home() {
  return (
    <div className="findox-scope page-wrapper">
      <Header />
      <main>
        <Hero />
        <Features />
        <About />
        <ClientLogos />
        <Services />
        <BookAppointment />
        <WhyChooseUs />
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
