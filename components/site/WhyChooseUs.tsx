import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { WHY_CHOOSE } from "./home-data";
import "./css/why.css";

/**
 * WhyChooseUs — the `.why-choose` two-column block. Left: heading, blurb and
 * three pill-shaped list rows (icon circle, title/text, arrow button) whose
 * pointed mint tail crossfades to a mirrored yellow-tailed layout on hover.
 * Right: a single image masked into a blob/square silhouette with a small
 * pulsing green+yellow shape layered beside it. Mirrors the reference's
 * `why-choose__item` / `why-choose__item--hover` sibling-swap pattern.
 */
export function WhyChooseUs() {
  return (
    <section className="why-choose section-space relative bg-white py-30 max-md:py-25 max-sm:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-2 lg:gap-x-6 lg:items-center">
          <div className="why-choose__content">
            <SectionHeading tagline={WHY_CHOOSE.tagline} lines={WHY_CHOOSE.title} taglineBg="#f4ebd8" />

            <Reveal direction="up" duration={1300}>
              <p className="why-choose__text mb-[25px] text-muted-foreground">{WHY_CHOOSE.text}</p>
            </Reveal>

            <div className="why-choose__item-box pr-0 md:pr-[70px] lg:max-xl:pr-0 xl:pr-[70px]">
              {WHY_CHOOSE.items.map((item, i) => (
                <Reveal
                  key={item.title}
                  direction="up"
                  duration={1300}
                  className={cn("why-choose__item-single group relative", i > 0 && "mt-[27px]")}
                >
                  {/* Default state: icon left, arrow right, mint pointed tail. */}
                  <div className="why-choose__item relative z-[1] flex items-center gap-5 rounded-[200px_0px_0px_200px] border border-border pt-2.5 pr-[15px] pb-2.5 pl-2.5 transition-all duration-500 max-sm:flex-col max-sm:items-start max-sm:rounded-[10px] max-sm:p-5 sm:group-hover:opacity-0 max-sm:group-hover:border-secondary max-sm:group-hover:bg-secondary">
                    <div className="why-choose__item__icon-box flex size-[70px] shrink-0 items-center justify-center rounded-full bg-accent transition-all duration-500 max-sm:group-hover:bg-primary">
                      <span className="why-choose__item__icon text-[34px] leading-none text-white transition-all duration-500 max-sm:group-hover:animate-[flipInY_1s_ease-in_1] max-sm:group-hover:text-accent">
                        <i className={item.icon} aria-hidden="true" />
                      </span>
                    </div>
                    <div className="why-choose__item__content flex w-[calc(100%-90px)] items-center justify-between gap-[30px] max-sm:w-full max-sm:flex-col max-sm:items-start max-sm:justify-start max-sm:gap-5">
                      <div className="why-choose__item__inner">
                        <h3 className="why-choose__item__title mb-1.5 text-[22px] leading-[1.272] font-bold text-foreground capitalize lg:max-xl:text-[19px]">
                          <Link href="#">{item.title}</Link>
                        </h3>
                        <p className="why-choose__item__text m-0 text-muted-foreground">{item.text}</p>
                      </div>
                      <div className="why-choose__item__btn flex shrink-0 items-center justify-end">
                        <Link
                          href="#"
                          aria-label={item.title}
                          className="why-choose__item__link flex size-[49px] shrink-0 items-center justify-center rounded-full bg-accent text-2xl text-white transition-all duration-500 hover:rotate-45 max-sm:hover:bg-primary max-sm:hover:text-accent"
                        >
                          <i className="icon-right-2" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Hover state: mirrored layout, yellow pointed tail on the left. */}
                  <div className="why-choose__item why-choose__item--hover absolute inset-0 z-[1] flex items-center gap-5 rounded-[0px_200px_200px_0px] border border-secondary bg-secondary pt-2.5 pr-2.5 pb-2.5 pl-[15px] opacity-0 transition-all duration-500 max-sm:hidden sm:group-hover:opacity-100">
                    <div className="why-choose__item__content flex w-[calc(100%-90px)] items-center justify-start gap-5">
                      <div className="why-choose__item__btn flex w-[65px] shrink-0 items-center justify-start">
                        <Link
                          href="#"
                          aria-label={item.title}
                          className="why-choose__item__link flex size-[49px] shrink-0 items-center justify-center rounded-full bg-accent text-2xl text-white transition-all duration-500 hover:rotate-45"
                        >
                          <i className="icon-right-2" aria-hidden="true" />
                        </Link>
                      </div>
                      <div className="why-choose__item__inner">
                        <h3 className="why-choose__item__title mb-1.5 text-[22px] leading-[1.272] font-bold text-foreground capitalize">
                          <Link href="#">{item.title}</Link>
                        </h3>
                        <p className="why-choose__item__text m-0 text-muted-foreground">{item.text}</p>
                      </div>
                    </div>
                    <div className="why-choose__item__icon-box flex size-[70px] shrink-0 items-center justify-center rounded-full bg-primary transition-all duration-500">
                      <span className="why-choose__item__icon text-[34px] leading-none text-accent transition-all duration-500">
                        <i className={item.icon} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal direction="up" duration={1300}>
            <div className="why-choose__image relative">
              <div className="why-choose__image__inner relative inline-block">
                <Image
                  src={WHY_CHOOSE.image}
                  alt="Why choose Carvi Associates"
                  width={570}
                  height={600}
                  className="why-choose__image__img relative z-[1] h-auto w-full max-w-full"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/shapes/why-choose-shape-1-1.png"
                  alt=""
                  aria-hidden="true"
                  width={195}
                  height={195}
                  className="why-choose__image__shape absolute top-[1px] -right-20 max-w-full"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
