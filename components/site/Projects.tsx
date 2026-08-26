"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { FindoxButton } from "./FindoxButton";
import type { ProjectCardItem, ProjectsContent } from "@/lib/cms/types";
import "./css/projects.css";

type ProjectsProps = {
  projects: ProjectsContent;
};

const ALL_FILTER = "all";

function ProjectCard({ project }: { project: ProjectCardItem }) {
  const href = project.href || "#";

  return (
    <article className="project-card relative overflow-hidden">
      <div className="project-card__image relative min-h-142.75 w-full bg-cover bg-top">
        <Image
          src={project.imageUrl}
          alt={project.imageAlt || project.title}
          fill
          sizes="(min-width: 1400px) 25vw, (min-width: 1200px) 33vw, (min-width: 768px) 50vw, 80vw"
          className="object-cover object-top"
        />

        {project.tags.length ? (
          <div className="project-card__category-group absolute top-0 left-0 flex w-full flex-wrap items-start gap-x-3 gap-y-3.75 p-5">
            {project.tags.map((tag, tagIndex) => (
              <Link
                key={`${tag.label}-${tagIndex}`}
                href={tag.href || "#"}
                data-tone={tag.tone}
                className="project-card__category rounded-[10px] px-3.75 py-2 text-base leading-snug font-semibold text-foreground uppercase"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <div className="project-card__content absolute bottom-0 left-0 w-full px-7.5 pb-13.25">
        <span className="project-card__icon relative mx-auto flex size-20 items-center justify-center rounded-t-[100px] bg-white text-[38px] leading-none text-accent">
          <i className={project.icon} aria-hidden="true" />
        </span>
        <div className="project-card__inner relative rounded-[20px] bg-primary px-7.5 pt-6.5 pb-5.75 text-center">
          <h3 className="project-card__title mb-1.5 text-[22px] leading-[1.318] font-bold text-foreground capitalize">
            <Link href={href}>{project.title}</Link>
          </h3>
          <p className="project-card__text mb-4 text-foreground/80">{project.text}</p>
          <Link
            href={href}
            aria-label={project.title}
            className="project-card__btn absolute -bottom-6 left-1/2 flex size-12.25 -translate-x-1/2 items-center justify-center rounded-full bg-white text-2xl text-accent"
          >
            <i className="icon-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Projects — the case-studies band: a dark textured top (heading + category
 * filter tabs), a horizontally snapping strip of tall cards whose tags, icon
 * and title flip into view on hover, and the mint bottom banner. Every string,
 * background, category, card and banner field is CMS-managed.
 */
export function Projects({ projects }: ProjectsProps) {
  const { section, categories, items } = projects;
  const [filter, setFilter] = useState(ALL_FILTER);

  const filters = useMemo(
    () =>
      section.showFilters && categories.length
        ? [
            { label: section.allFilterLabel, value: ALL_FILTER },
            ...categories.map((category) => ({
              label: category.label,
              value: category.slug,
            })),
          ]
        : [],
    [categories, section.allFilterLabel, section.showFilters],
  );

  const visibleItems = useMemo(
    () =>
      filter === ALL_FILTER
        ? items
        : items.filter((item) => item.categorySlug === filter),
    [filter, items],
  );

  if (!section.isVisible || !items.length) return null;

  return (
    <section id="projects" className="projects-one projects projects--two relative pt-30 max-md:pt-25 max-sm:pt-20">
      <div
        className="projects-one__bg absolute top-0 left-0 h-93.75 w-full bg-cover bg-top max-xl:h-175 max-md:h-187.5 max-[430px]:h-200"
        style={{ backgroundImage: `url(${section.topBackgroundImageUrl})` }}
        aria-hidden="true"
      />

      <Container className="relative z-1">
        <div className="projects__top mb-32.25 max-xl:mb-15">
          <div className="grid gap-y-10 xl:grid-cols-2 xl:items-center">
            <SectionHeading
              light
              taglineBg={section.taglineBg}
              tagline={section.tagline}
              lines={[...section.title]}
            />

            {filters.length ? (
              <Reveal direction="up" duration={1300}>
                <ul className="projects__filter__list m-0 flex list-none flex-wrap items-center justify-center gap-0 xl:justify-end">
                  {filters.map((option) => {
                    const active = option.value === filter;
                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          onClick={() => setFilter(option.value)}
                          aria-pressed={active}
                          className={cn(
                            "item cursor-pointer border px-7.5 py-[9.5px] text-center font-heading text-base font-semibold capitalize transition-all duration-500 hover:border-primary hover:bg-primary hover:text-primary-foreground",
                            active
                              ? "active border-primary bg-primary text-primary-foreground"
                              : "border-border bg-transparent text-white",
                          )}
                        >
                          <span>{option.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Container>

      <div className="projects-one__container relative z-1 mx-auto w-full max-w-300 px-4 sm:px-6 md:max-w-full md:px-7.5">
        {visibleItems.length ? (
          <ul className="scrollbar-hide m-0 flex list-none snap-x snap-mandatory gap-7.5 overflow-x-auto scroll-smooth">
            {visibleItems.map((project, index) => (
              <li
                key={project.id}
                className="w-[78%] shrink-0 snap-start sm:w-[55%] md:w-[calc(50%-15px)] lg:w-[calc(50%-15px)] xl:w-[calc(33.333%-20px)] 2xl:w-[calc(25%-22.5px)]"
              >
                <Reveal direction="up" duration={1300} delay={(index % 4 + 1) * 100}>
                  <ProjectCard project={project} />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[20px] border border-border/60 bg-white/90 px-7.5 py-12 text-center font-medium text-muted-foreground">
            No case studies in this category yet.
          </p>
        )}
      </div>

      {section.showBottomBanner ? (
        <div className="projects__bottom relative z-1 mt-7.5">
          <div
            className="projects__bg absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: `url(${section.bottomBackgroundImageUrl})` }}
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
                  {section.bannerStat} {section.bannerTitle[0]}
                  <br />
                  {section.bannerTitle[1]}
                </h3>
                {section.bannerChecklist.length ? (
                  <ul className="projects__info__list m-0 list-none">
                    {section.bannerChecklist.map((line) => (
                      <li key={line} className="font-medium text-muted-foreground">
                        <span className="projects__info__list__icon relative -top-px mr-2.5 inline-flex size-5.25 items-center justify-center rounded-full bg-primary text-[11px] text-accent">
                          <i className="icon-check" aria-hidden="true" />
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>

              <Reveal
                direction="up"
                duration={1300}
                delay={200}
                className="projects__button text-center lg:text-right"
              >
                <FindoxButton
                  variant="base"
                  href={section.bannerButtonHref || "#"}
                  text={section.bannerButtonText}
                />
              </Reveal>
            </div>
          </Container>
        </div>
      ) : null}
    </section>
  );
}
