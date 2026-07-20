import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { WORKING_PROCESS } from "./home-data";
import "./css/process.css";

/**
 * WorkingProcess — the `.working-process` zig-zag 4-step timeline. At `lg`+
 * the columns alternate image-top/badge-top (`.working-process__card--two`'s
 * `flex-direction: column-reverse` in the reference), and a thin connecting
 * line — yellow start-dot on the left, arrow flourish on the right — runs
 * behind the "STEP 0N" badges. Below `lg` it drops to a plain 1/2 column
 * stack (see process.css for the line/dot/arrow geometry notes).
 */
export function WorkingProcess() {
  return (
    <section className="working-process section-space bg-white py-30 max-md:py-25 max-sm:py-20">
      <Container>
        <SectionHeading align="center" tagline={WORKING_PROCESS.tagline} lines={WORKING_PROCESS.title} />

        <div className="working-process__row grid grid-cols-1 gap-x-7.5 gap-y-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {WORKING_PROCESS.steps.map((step, i) => {
            const isUp = i % 2 === 1;
            const isFirst = i === 0;
            const isLast = i === WORKING_PROCESS.steps.length - 1;

            return (
              <Reveal key={step.title} direction="up" delay={i * 100} className="working-process__item">
                <div
                  className={cn(
                    "flex flex-col items-center gap-7.5 text-center",
                    isUp && "lg:flex-col-reverse",
                  )}
                >
                  <div
                    className={cn(
                      "working-process__image group relative aspect-232/206 w-full",
                      !isUp && !isLast && "working-process__image--right",
                      !isUp && !isFirst && "working-process__image--left",
                    )}
                  >
                    {isFirst && (
                      <span className="working-process__dot pointer-events-none absolute inset-0" aria-hidden="true" />
                    )}
                    <div className="absolute inset-0 overflow-hidden rounded-[20px]">
                      <Image
                        src={step.image}
                        alt=""
                        fill
                        sizes="(min-width: 1200px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="working-process__image__overlay absolute inset-0 flex items-center justify-center bg-accent/60 opacity-0 group-hover:opacity-100">
                        <Link
                          href="#"
                          aria-label={`Learn more about ${step.title}`}
                          className="flex size-12.25 items-center justify-center rounded-full bg-white text-2xl text-accent transition-colors duration-500 hover:bg-primary hover:text-accent"
                        >
                          <i className="icon-right" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="working-process__content relative w-full">
                    {isUp && isLast && (
                      <span className="working-process__arrow pointer-events-none absolute inset-0" aria-hidden="true" />
                    )}
                    <span className="working-process__step relative z-1 inline-flex h-9 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold tracking-wide text-white uppercase">
                      {step.step}
                    </span>
                    <h3 className="working-process__title mt-6 mb-2.5 text-[22px] leading-[1.272] font-bold text-foreground capitalize">
                      <Link href="#">{step.title}</Link>
                    </h3>
                    <p className="working-process__text m-0 text-muted-foreground">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
