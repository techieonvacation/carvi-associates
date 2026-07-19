import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { FindoxButton } from "./FindoxButton";
import { BOOK_APPOINTMENT } from "./home-data";

export function BookAppointment() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div
        className="absolute inset-0 bg-scroll bg-cover bg-center sm:bg-fixed"
        style={{ backgroundImage: `url(${BOOK_APPOINTMENT.image})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-accent/90 mix-blend-multiply" aria-hidden="true" />
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            align="center"
            light
            tagline={BOOK_APPOINTMENT.tagline}
            lines={BOOK_APPOINTMENT.title}
          />
          <Reveal direction="up" delay={100}>
            <p className="mt-6 text-white/80">{BOOK_APPOINTMENT.text}</p>
          </Reveal>
          <Reveal direction="up" delay={200}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <FindoxButton href="#" text="Get Started" />
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-primary"
              >
                Contact Now
                <i className="icon-arrow-right-up" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
