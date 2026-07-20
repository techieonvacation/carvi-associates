import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { FEATURES } from "./home-data";
import "./css/features.css";

/**
 * Features — three icon cards on a floating white bar with a rounded
 * bottom edge, two-tone dividers, and hover effects (yellow ribbon wipe,
 * icon flip). Mirrors the reference `.features-one` owl row (1 / 2 / 3
 * items at 0 / 768 / 992).
 */
export function Features() {
  return (
    <section className="features-one relative z-[1] overflow-hidden bg-white pb-30 max-md:pb-25 max-sm:pb-20">
      <Container>
        <Reveal direction="down" duration={1300}>
          <div className="features-one__carousel grid grid-cols-1 gap-[30px] rounded-b-[15px] bg-white md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="features-one__card group relative flex items-start gap-5 px-[30px] pt-12 pb-[45px] max-[440px]:flex-col max-[440px]:pt-10 max-[440px]:pb-[37px] md:max-lg:px-[25px] md:max-lg:pt-[38px] md:max-lg:pb-[35px] lg:max-xl:flex-col"
              >
                <div className="features-one__card__icon-box relative top-1 flex size-[75px] shrink-0 items-center justify-center rounded-[10px] bg-accent transition-all duration-500 group-hover:bg-primary md:max-lg:size-[60px]">
                  <span className="features-one__card__icon text-[38px] leading-none text-white transition-all duration-500 group-hover:text-accent md:max-lg:text-[30px]">
                    <i className={feature.icon} aria-hidden="true" />
                  </span>
                </div>
                <div className="features-one__card__content">
                  <h4 className="features-one__card__title mb-1.5 text-[22px] leading-[1.272] font-bold text-foreground capitalize md:max-lg:text-[20px]">
                    <Link href="#">{feature.title}</Link>
                  </h4>
                  <p className="features-one__card__text m-0 text-muted-foreground">
                    {feature.text}
                  </p>
                </div>
                {i < FEATURES.length - 1 && (
                  <span className="features-one__card__border" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
