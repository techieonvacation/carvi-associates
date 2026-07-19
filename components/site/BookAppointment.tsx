import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { FindoxButton } from "./FindoxButton";
import { BOOK_APPOINTMENT } from "./home-data";
import "./css/book.css";

/**
 * BookAppointment — the dark "book-appointment" band between Services and
 * WhyChooseUs: a jarallax photo background under a heavy brand-green
 * overlay, a centred light `sec-title` + copy + two CTAs (a white
 * "Get Started" pill and a yellow "Contact Now" pill that wipes to white
 * on hover), and two yellow masked corner blobs pinned to the section
 * edges. Mirrors the reference `.book-appointment` section.
 */
export function BookAppointment() {
  return (
    <section className="book-appointment section-space relative bg-[#222222] py-30 max-md:py-25 max-sm:py-20">
      <div
        className="book-appointment__bg jarallax absolute inset-0 bg-scroll bg-top bg-cover bg-no-repeat md:bg-fixed"
        style={{ backgroundImage: `url(${BOOK_APPOINTMENT.image})` }}
        aria-hidden="true"
      />

      <Container className="relative z-2">
        <div className="mx-auto lg:max-w-[75%] xl:max-w-[58.3333%]">
          <div className="book-appointment__content text-center">
            <SectionHeading
              align="center"
              light
              taglineBg="#ECF5F4"
              tagline={BOOK_APPOINTMENT.tagline}
              lines={BOOK_APPOINTMENT.title}
              className="mb-2.75!"
            />

            <Reveal direction="up" duration={1300}>
              <p className="book-appointment__text mb-6.75 text-white">
                {BOOK_APPOINTMENT.text}
              </p>
            </Reveal>

            <Reveal direction="up" duration={1300}>
              <div className="book-appointment__button flex flex-wrap items-center justify-center gap-x-7.5 gap-y-6.25">
                <FindoxButton
                  href="#"
                  text="Get Started"
                  className="findox-btn--white"
                />
                <FindoxButton
                  href="#"
                  text="Contact Now"
                  className="book-appointment__btn-2"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      <Reveal direction="right" duration={1300}>
        <div className="book-appointment__shape-1" aria-hidden="true" />
      </Reveal>
      <Reveal direction="left" duration={1300}>
        <div className="book-appointment__shape-2" aria-hidden="true" />
      </Reveal>
    </section>
  );
}
