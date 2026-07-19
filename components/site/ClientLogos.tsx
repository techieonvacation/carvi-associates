import { Container } from "./Container";
import { Carousel } from "./Carousel";
import "./css/client.css";

/**
 * ClientLogos — the `.client-carousel` band. A centred uppercase headline
 * (yellow 330+/200+ counts) flanked by `//` shape marks and thin divider
 * lines, above an autoplaying row of client logos that swap to a coloured
 * "-hover" variant inside a green pill on hover. Mirrors the reference owl
 * carousel (5 / 4 / 3 / 2 / 1 items at 1200 / 992 / 768 / 431 / 0, margin 40).
 */

// The blade references only brand-1-1(-hover); repeated to fill the band.
const LOGOS = Array.from({ length: 8 }, () => ({
  src: "/images/resources/brand-1-1.png",
  hover: "/images/resources/brand-1-1-hover.png",
}));

export function ClientLogos() {
  return (
    <section className="client-carousel relative bg-white">
      <Container>
        <div className="client-carousel__content text-center">
          <h4 className="client-carousel__title m-0 text-[16px] leading-[1.625] font-medium text-[#333333] uppercase">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/shapes/sec-title-shape-1-1.png"
              alt="shape"
              width={18}
              height={18}
              className="client-carousel__title__shape relative top-[-2px] inline-block max-w-full"
            />{" "}
            Over <span className="text-primary">330+</span> Projects With{" "}
            <span className="text-primary">200+</span> Clients{" "}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/shapes/sec-title-shape-1-1.png"
              alt="shape"
              width={18}
              height={18}
              className="client-carousel__title__shape relative top-[-2px] inline-block max-w-full"
            />
          </h4>
        </div>

        <div className="client-carousel__carousel relative pt-[93px] pb-[100px] max-lg:pt-[73px] max-lg:pb-[80px] max-sm:pt-[53px] max-sm:pb-[60px]">
          <Carousel
            autoplay={6000}
            showArrows={false}
            showDots={false}
            gapClassName="gap-10"
            itemClassName="basis-full min-[431px]:basis-[calc(50%-20px)] md:basis-[calc(33.333%-26.667px)] lg:basis-[calc(25%-30px)] xl:basis-[calc(20%-32px)]"
            items={LOGOS.map((logo, i) => (
              <div
                key={i}
                className="client-carousel__item group/logo relative flex items-center justify-center px-[42px] py-[17.5px] text-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt="findox"
                  width={122}
                  height={24}
                  className="client-carousel__image mx-auto w-auto max-w-full"
                />
                <div className="client-carousel__hover absolute inset-0 flex items-center justify-center rounded-[50px] border border-accent px-[42px] py-[17.5px] opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.hover}
                    alt="findox"
                    width={122}
                    height={24}
                    className="client-carousel__hover__image w-auto max-w-full"
                  />
                </div>
              </div>
            ))}
          />
        </div>
      </Container>
    </section>
  );
}
