import Link from "next/link";
import { Container } from "./Container";
import { Carousel } from "./Carousel";
import { Reveal } from "./Reveal";
import { FEATURES } from "./home-data";

export function Features() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Carousel
          autoplay={3200}
          showArrows={false}
          showDots={false}
          itemClassName="basis-full sm:basis-1/2 lg:basis-1/3"
          items={FEATURES.map((feature, i) => (
            <Reveal key={feature.title} direction="down" delay={i * 100} className="h-full px-1 pb-1">
              <div className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-lg">
                <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-2xl text-accent">
                  <i className={feature.icon} aria-hidden="true" />
                </span>
                <div>
                  <h4 className="font-heading text-xl font-bold text-foreground!">
                    <Link href="#" className="transition-colors hover:text-accent">
                      {feature.title}
                    </Link>
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.text}</p>
                </div>
                <span className="absolute inset-x-8 bottom-0 h-1 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        />
      </Container>
    </section>
  );
}
