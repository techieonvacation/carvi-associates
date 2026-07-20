import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SERVICES } from "./home-data";
import "./css/services.css";

/**
 * Services — the "services-one" grid of six white service-card tiles on a
 * mint section background. Each card layers a masked white background shape
 * (service-card__bg) with a photo that wipes in from the left on hover
 * (service-card__bg__main, via next/image sized to its animated-width
 * wrapper so object-cover reproduces the reference's background-size:cover
 * reveal), a yellow line-art icon + huge outline number above a divider
 * tick, and a circular findox-style arrow button pinned to the notch at the
 * card's bottom-right corner. Mirrors the reference `.services-one` /
 * `.service-card` markup 1:1.
 */
export function Services() {
  return (
    <section className="services-one section-space bg-secondary py-30 max-md:py-25 max-sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          tagline={SERVICES.tagline}
          lines={SERVICES.title}
          taglineBg="#fffdf8"
        />

        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((service, i) => (
            <Reveal key={service.title.join(" ")} direction="up" delay={(i + 1) * 100} duration={1300}>
              <div className="service-card group relative overflow-hidden rounded-[20px]">
                <div className="service-card__bg absolute inset-0 rounded-[inherit] bg-white">
                  <div className="service-card__bg__main absolute top-0 left-0 h-full w-0 overflow-hidden transition-[width] duration-600 group-hover:w-full">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="(min-width: 992px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                <div
                  className="service-card__content relative z-[1] pt-[43.5px] px-[38px] pb-[49.5px] transition-all duration-500 max-[375px]:pt-[30px] max-[375px]:px-[25px] min-[376px]:max-[412px]:pt-[30px] min-[376px]:max-[412px]:px-[30px] md:pt-[30px] md:px-[30px] lg:pt-[30px] lg:px-[25px] xl:pt-[43.5px] xl:px-[38px]"
                >
                  <div className="service-card__tagline mb-[19px] flex items-start gap-2.5">
                    <svg
                      width="23"
                      height="23"
                      viewBox="0 0 23 23"
                      fill="none"
                      className="mt-0.5 h-[23px] w-[23px] shrink-0"
                      aria-hidden="true"
                    >
                      <rect
                        x="11.5"
                        y="3.01463"
                        width="12"
                        height="12"
                        transform="rotate(45 11.5 3.01463)"
                        strokeWidth={3}
                        className="stroke-accent transition-colors duration-500 group-hover:stroke-primary"
                      />
                    </svg>
                    <p className="service-card__tagline__text m-0 text-muted-foreground transition-colors duration-500 group-hover:text-white">
                      {SERVICES.tagline2}
                    </p>
                  </div>

                  <h3 className="service-card__title mb-3 text-[22px] leading-[1.272] font-bold text-foreground capitalize transition-colors duration-500 group-hover:text-white max-[375px]:text-[21px] lg:text-[20px] xl:text-[22px]">
                    <Link href="#">
                      {service.title[0]}
                      <br />
                      {service.title[1]}
                    </Link>
                  </h3>

                  <p className="service-card__text mb-[22px] text-muted-foreground transition-colors duration-500 group-hover:text-white">
                    {service.text}
                  </p>

                  <div className="service-card__bottom relative flex items-center gap-[68px] max-[360px]:gap-[40px] lg:gap-[43px] xl:gap-[68px]">
                    <span className="service-card__icon inline-flex shrink-0 text-[70px] leading-none text-accent transition-colors duration-500 group-hover:text-white">
                      <i className={service.icon} aria-hidden="true" />
                    </span>
                    <h4 className="service-card__number relative m-0 leading-none after:absolute after:bottom-[-68px] after:left-1/2 after:h-[45px] after:w-[2px] after:-translate-x-1/2 after:rounded-full after:bg-border after:transition-colors after:duration-500 after:content-[''] group-hover:after:bg-primary">
                      {/* Real text in an inner span (not directly on the h4) so the
                          transparent fill isn't clobbered by the `.findox-scope h4`
                          color rule — mirrors the reference's decoupled ::before glyph. */}
                      <span className="text-stroke inline-block text-[40px] font-semibold [--stroke-color:#cdae7c] [writing-mode:sideways-lr] transition-colors duration-500 group-hover:[--stroke-color:#e3c9a0]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </h4>
                  </div>

                  <Link
                    href="#"
                    aria-label={`Learn more about ${service.title.join(" ")}`}
                    className="service-card__btn absolute right-0 bottom-0 flex size-[71px] items-center justify-center rounded-full bg-accent text-[36px] text-white transition-all duration-500 group-hover:bg-primary group-hover:text-accent hover:rotate-45 max-[375px]:bottom-[16px] max-[375px]:size-[60px] max-[375px]:text-[28px] lg:bottom-[16px] lg:size-[60px] lg:text-[28px] xl:bottom-0 xl:size-[71px] xl:text-[36px]"
                  >
                    <i className="icon-arrow-right-up" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
