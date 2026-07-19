import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Carousel } from "./Carousel";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { WORKING_PROCESS } from "./home-data";

export function WorkingProcess() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading align="center" tagline={WORKING_PROCESS.tagline} lines={WORKING_PROCESS.title} />

        <div className="mt-14">
          <Carousel
            autoplay={3600}
            itemClassName="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            items={WORKING_PROCESS.steps.map((step, i) => (
              <Reveal key={step.title} direction="up" delay={(i % 4) * 100} className="h-full px-1 pb-1">
                <div className="group relative aspect-4/5 overflow-hidden rounded-3xl">
                  <Image
                    src={step.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

                  <Link
                    href="#"
                    aria-label={`Learn more about ${step.title}`}
                    className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-full bg-white/90 text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  >
                    <i className="icon-right" aria-hidden="true" />
                  </Link>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span
                      className={cn(
                        "inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase",
                        i % 2 === 1 ? "bg-white text-accent" : "bg-primary text-primary-foreground",
                      )}
                    >
                      {step.step}
                    </span>
                    <h4 className="mt-3 font-heading text-xl font-bold text-white!">
                      <Link href="#" className="transition-colors hover:text-primary">
                        {step.title}
                      </Link>
                    </h4>
                    <p className="mt-1 text-sm text-white/70">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          />
        </div>
      </Container>
    </section>
  );
}
