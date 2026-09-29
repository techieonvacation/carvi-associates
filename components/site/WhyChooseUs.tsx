import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import type { WhyChooseContent, WhyChooseItem } from "@/lib/cms/types";
import "./css/why.css";

type WhyChooseUsProps = {
  whyChoose: WhyChooseContent;
};

function ItemBody({ item, href }: { item: WhyChooseItem; href: string }) {
  return (
    <div className="why-choose__item__inner">
      <h3 className="why-choose__item__title mb-1.5 text-[22px] leading-[1.272] font-bold text-foreground capitalize lg:max-xl:text-[19px]">
        <Link href={href}>{item.title}</Link>
      </h3>
      <p className="why-choose__item__text m-0 text-muted-foreground">{item.text}</p>
    </div>
  );
}

function ItemLink({ item, href }: { item: WhyChooseItem; href: string }) {
  return (
    <Link
      href={href}
      aria-label={item.title}
      className="why-choose__item__link flex size-[49px] shrink-0 items-center justify-center rounded-full text-2xl transition-all duration-500"
    >
      <i className="icon-right-2" aria-hidden="true" />
    </Link>
  );
}

export function WhyChooseUs({ whyChoose }: WhyChooseUsProps) {
  if (!whyChoose.isVisible || !whyChoose.items.length) {
    return null;
  }

  return (
    <section
      id="why-choose-us"
      className="why-choose section-space relative bg-background py-30 max-md:py-25 max-sm:py-20"
    >
      <Container>
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-2 lg:items-stretch lg:gap-x-6">
          <div className="why-choose__content">
            <SectionHeading
              tagline={whyChoose.tagline}
              lines={[...whyChoose.title]}
              taglineBg={whyChoose.taglineBg}
            />

            <Reveal direction="up" duration={1300}>
              <p className="why-choose__text mb-[25px] text-muted-foreground">
                {whyChoose.description}
              </p>
            </Reveal>

            <div className="why-choose__item-box pr-0 md:pr-[70px] lg:max-xl:pr-0 xl:pr-[70px]">
              {whyChoose.items.map((item, index) => {
                const href = item.href || "#";

                return (
                  <Reveal
                    key={item.id}
                    direction="up"
                    duration={1300}
                    className={cn(
                      "why-choose__item-single group relative",
                      index > 0 && "mt-[27px]",
                    )}
                  >
                    <div className="why-choose__item relative z-[1] flex items-center gap-5 rounded-[200px_0px_0px_200px] border border-border pt-2.5 pr-[15px] pb-2.5 pl-2.5 transition-all duration-500 max-sm:flex-col max-sm:items-start max-sm:rounded-[10px] max-sm:p-5 max-sm:group-hover:border-secondary max-sm:group-hover:bg-secondary sm:group-hover:opacity-0">
                      <div className="why-choose__item__icon-box flex size-[70px] shrink-0 items-center justify-center rounded-full bg-accent transition-all duration-500 max-sm:group-hover:bg-primary">
                        <span className="why-choose__item__icon text-[34px] leading-none text-white transition-all duration-500 max-sm:group-hover:animate-[flipInY_1s_ease-in_1] max-sm:group-hover:text-accent">
                          <i className={item.icon} aria-hidden="true" />
                        </span>
                      </div>
                      <div className="why-choose__item__content flex w-[calc(100%-90px)] items-center justify-between gap-[30px] max-sm:w-full max-sm:flex-col max-sm:items-start max-sm:justify-start max-sm:gap-5">
                        <ItemBody item={item} href={href} />
                        <div className="why-choose__item__btn flex shrink-0 items-center justify-end">
                          <ItemLink item={item} href={href} />
                        </div>
                      </div>
                    </div>

                    <div className="why-choose__item why-choose__item--hover absolute inset-0 z-[1] flex items-center gap-5 rounded-[0px_200px_200px_0px] border border-secondary bg-secondary pt-2.5 pr-2.5 pb-2.5 pl-[15px] opacity-0 transition-all duration-500 max-sm:hidden sm:group-hover:opacity-100">
                      <div className="why-choose__item__content flex w-[calc(100%-90px)] items-center justify-start gap-5">
                        <div className="why-choose__item__btn flex size-[65px] shrink-0 items-center justify-start">
                          <ItemLink item={item} href={href} />
                        </div>
                        <ItemBody item={item} href={href} />
                      </div>
                      <div className="why-choose__item__icon-box flex size-[70px] shrink-0 items-center justify-center rounded-full bg-primary transition-all duration-500">
                        <span className="why-choose__item__icon text-[34px] leading-none text-accent transition-all duration-500">
                          <i className={item.icon} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal direction="up" duration={1300} className="flex">
            <div className="why-choose__image relative w-full">
              <div
                className="why-choose__image__inner relative mx-auto aspect-[570/600] w-full max-w-[570px] lg:mx-0"
                style={
                  { "--why-frame-min": `${whyChoose.imageMinHeightPx}px` } as React.CSSProperties
                }
              >
                <Image
                  src={whyChoose.imageUrl}
                  alt={whyChoose.imageAlt}
                  fill
                  sizes="(max-width: 991px) 100vw, 570px"
                  className={cn(
                    "why-choose__image__img z-[1]",
                    whyChoose.imageFit === "contain" ? "object-contain" : "object-cover",
                  )}
                />
                {whyChoose.showImageShape ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={whyChoose.shapeImageUrl}
                    alt=""
                    aria-hidden="true"
                    width={195}
                    height={195}
                    className="why-choose__image__shape absolute top-[1px] -right-20 z-0 max-w-full"
                  />
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
