import Image from "next/image";
import { Container } from "./Container";
import { Carousel } from "./Carousel";
import { Reveal } from "./Reveal";
import { CLIENTS } from "./home-data";

const LOGO_SLOTS = Array.from({ length: 8 });

export function ClientLogos() {
  return (
    <section className="border-y border-border bg-secondary/40 py-14">
      <Container>
        <Reveal direction="up">
          <p className="mb-10 text-center font-heading text-xl font-semibold text-foreground sm:text-2xl">
            Over <span className="text-accent">330+</span> Projects With{" "}
            <span className="text-accent">200+</span> Clients
          </p>
        </Reveal>

        <Carousel
          autoplay={2600}
          showArrows={false}
          showDots={false}
          gapClassName="gap-10"
          itemClassName="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
          items={LOGO_SLOTS.map((_, i) => (
            <div key={i} className="group/logo relative h-12 w-full">
              <Image
                src={CLIENTS.logo}
                alt="Client logo"
                fill
                sizes="140px"
                className="object-contain opacity-60 grayscale transition-opacity duration-300 group-hover/logo:opacity-0"
              />
              <Image
                src={CLIENTS.logoHover}
                alt=""
                fill
                sizes="140px"
                aria-hidden="true"
                className="object-contain opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100"
              />
            </div>
          ))}
        />
      </Container>
    </section>
  );
}
