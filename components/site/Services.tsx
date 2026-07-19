import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SERVICES } from "./home-data";

export function Services() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading align="center" tagline={SERVICES.tagline} lines={SERVICES.title} />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((service, i) => (
            <Reveal key={service.title.join(" ")} direction="up" delay={(i % 3) * 100}>
              <div className="group relative h-96 overflow-hidden rounded-3xl">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/10" />

                <div className="relative flex h-full flex-col justify-between p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-full bg-white/15 text-xl text-white backdrop-blur-sm">
                      <i className={service.icon} aria-hidden="true" />
                    </span>
                    <span className="font-heading text-3xl font-bold text-white/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-primary uppercase">
                      <span className="inline-block size-1.5 rotate-45 bg-primary" aria-hidden="true" />
                      {SERVICES.tagline2}
                    </p>
                    <h4 className="font-heading text-xl leading-tight font-bold text-white!">
                      <Link href="#" className="transition-colors hover:text-primary">
                        {service.title[0]}
                        <br />
                        {service.title[1]}
                      </Link>
                    </h4>
                    <p className="mt-2 text-sm text-white/70">{service.text}</p>
                    <Link
                      href="#"
                      aria-label={`Learn more about ${service.title.join(" ")}`}
                      className="mt-4 inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    >
                      <i className="icon-right-2" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
