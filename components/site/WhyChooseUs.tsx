import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { WHY_CHOOSE } from "./home-data";

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading tagline={WHY_CHOOSE.tagline} lines={WHY_CHOOSE.title} />
            <Reveal direction="up" delay={100}>
              <p className="mt-6 text-muted-foreground">{WHY_CHOOSE.text}</p>
            </Reveal>

            <div className="mt-8 space-y-4">
              {WHY_CHOOSE.items.map((item, i) => (
                <Reveal key={item.title} direction="up" delay={(i + 1) * 100}>
                  <div className="group flex items-center gap-5 rounded-2xl border border-border p-5 transition-colors hover:border-accent hover:bg-secondary/50">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary text-2xl text-accent">
                      <i className={item.icon} aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <h4 className="font-heading text-lg font-bold text-foreground!">
                        <Link href="#" className="hover:text-accent">
                          {item.title}
                        </Link>
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                    </div>
                    <Link
                      href="#"
                      aria-label={item.title}
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-1"
                    >
                      <i className="icon-right-2" aria-hidden="true" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal direction="right">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/shapes/why-choose-shape-1-1.png"
                alt=""
                aria-hidden="true"
                className="absolute -top-10 -right-10 -z-10 w-40 opacity-70"
              />
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
                <Image
                  src={WHY_CHOOSE.image}
                  alt="Advisor presenting a business plan"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
