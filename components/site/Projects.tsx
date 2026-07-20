"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { FindoxButton } from "./FindoxButton";
import { PROJECTS, PROJECT_FILTERS } from "./home-data";
import "./css/projects.css";

/**
 * Projects — the `.projects-one` case-studies band: a dark textured top
 * (heading + owl-style filter tabs), a horizontally scrolling strip of
 * tall `.project-card`s whose tags/icon/title flip into view on hover,
 * sitting on top of the mint `.projects__bottom` banner.
 */
export function Projects() {
  const [filter, setFilter] = useState("all");

  const items = useMemo(
    () => (filter === "all" ? PROJECTS.items : PROJECTS.items.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section className="projects-one projects projects--two relative pt-30 max-md:pt-25 max-sm:pt-20">
      {/* Dark, accent-tinted textured band behind the heading + filter row. */}
      <div
        className="projects-one__bg absolute top-0 left-0 h-93.75 w-full bg-cover bg-top max-xl:h-175 max-md:h-187.5 max-[430px]:h-200"
        style={{ backgroundImage: "url(/images/shapes/projects-bg-shape-1-1.png)" }}
        aria-hidden="true"
      />

      <Container className="relative z-1">
        <div className="projects__top mb-32.25 max-xl:mb-15">
          <div className="grid gap-y-10 xl:grid-cols-2 xl:items-center">
            <SectionHeading light taglineBg="#fffdf8" tagline={PROJECTS.tagline} lines={PROJECTS.title} />

            <Reveal direction="up" duration={1300}>
              <ul className="projects__filter__list m-0 flex list-none flex-wrap items-center justify-center gap-0 xl:justify-end">
                {PROJECT_FILTERS.map((f) => (
                  <li
                    key={f.value}
                    role="button"
                    tabIndex={0}
                    onClick={() => setFilter(f.value)}
                    onKeyDown={(e) => e.key === "Enter" && setFilter(f.value)}
                    className={cn(
                      "item cursor-pointer border px-7.5 py-[9.5px] text-center font-heading text-base font-semibold capitalize transition-all duration-500 hover:border-primary hover:bg-primary hover:text-primary-foreground",
                      f.value === filter
                        ? "active border-primary bg-primary text-primary-foreground"
                        : "border-border bg-transparent text-white",
                    )}
                  >
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>

      <div className="projects-one__container relative z-1 mx-auto w-full max-w-300 px-4 sm:px-6 md:max-w-full md:px-7.5">
        <div className="scrollbar-hide flex gap-7.5 overflow-x-auto">
          {items.map((project, i) => (
            <Reveal
              key={project.title}
              direction="up"
              duration={1300}
              delay={(i + 1) * 100}
              className="w-[78%] shrink-0 sm:w-[55%] md:w-[calc(50%-15px)] lg:w-[calc(50%-15px)] xl:w-[calc(33.333%-20px)] 2xl:w-[calc(25%-22.5px)]"
            >
              <div className="project-card relative overflow-hidden">
                <div className="project-card__image relative min-h-142.75 w-full bg-cover bg-top">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1400px) 25vw, (min-width: 1200px) 33vw, (min-width: 768px) 50vw, 80vw"
                    className="object-cover object-top"
                  />

                  <div className="project-card__category-group absolute top-0 left-0 flex w-full flex-wrap items-start gap-x-3 gap-y-3.75 p-5">
                    {project.tags.map((tag, tagIdx) => (
                      <Link
                        key={`${tag}-${tagIdx}`}
                        href="#"
                        className={cn(
                          "project-card__category rounded-[10px] px-3.75 py-2 text-base leading-snug font-semibold text-foreground uppercase",
                          tagIdx === 0 ? "bg-primary" : "bg-white",
                        )}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="project-card__content absolute bottom-0 left-0 w-full px-7.5 pb-13.25">
                  <span className="project-card__icon relative mx-auto flex size-20 items-center justify-center rounded-t-[100px] bg-white text-[38px] leading-none text-accent">
                    <i className={project.icon} aria-hidden="true" />
                  </span>
                  <div className="project-card__inner relative rounded-[20px] bg-primary px-7.5 pt-6.5 pb-5.75 text-center">
                    <h3 className="project-card__title mb-1.5 text-[22px] leading-[1.318] font-bold text-foreground capitalize">
                      <Link href="#">{project.title}</Link>
                    </h3>
                    <p className="project-card__text mb-4 text-foreground/80">{project.text}</p>
                    <Link
                      href="#"
                      className="project-card__btn absolute -bottom-6 left-1/2 flex size-12.25 -translate-x-1/2 items-center justify-center rounded-full bg-white text-2xl text-accent"
                    >
                      <i className="icon-right" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="projects__bottom relative z-1 mt-7.5">
        <div
          className="projects__bg absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: "url(/images/shapes/projects-bg-shape-1-2.png)" }}
          aria-hidden="true"
        />
        <Container className="relative z-1">
          <div className="projects__bottom__inner grid gap-y-7.5 py-20.75 max-lg:pb-21.75 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-x-14">
            <Reveal
              direction="up"
              duration={1300}
              delay={100}
              className="projects__info relative pl-15 max-lg:pl-0 max-lg:text-center"
            >
              <h3 className="projects__info__title mb-2.75 text-[22px] leading-[1.272] font-bold text-foreground max-[430px]:text-xl">
                {PROJECTS.bottomBanner.stat} {PROJECTS.bottomBanner.title[0]}
                <br />
                {PROJECTS.bottomBanner.title[1]}
              </h3>
              <ul className="projects__info__list m-0 list-none">
                {PROJECTS.bottomBanner.checklist.map((line) => (
                  <li key={line} className="font-medium text-muted-foreground">
                    <span className="projects__info__list__icon relative -top-px mr-2.5 inline-flex size-5.25 items-center justify-center rounded-full bg-primary text-[11px] text-accent">
                      <i className="icon-check" aria-hidden="true" />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal direction="up" duration={1300} delay={200} className="projects__button text-center lg:text-right">
              <FindoxButton variant="base" href="#" text={PROJECTS.bottomBanner.button} />
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
