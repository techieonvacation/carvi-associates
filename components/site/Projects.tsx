"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Carousel } from "./Carousel";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { FindoxButton } from "./FindoxButton";
import { PROJECTS, PROJECT_FILTERS } from "./home-data";

export function Projects() {
  const [filter, setFilter] = useState("all");

  const items = useMemo(
    () => (filter === "all" ? PROJECTS.items : PROJECTS.items.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section className="bg-[#131111] py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading light tagline={PROJECTS.tagline} lines={PROJECTS.title} />

          <Reveal direction="up">
            <div className="flex flex-wrap gap-2">
              {PROJECT_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors",
                    f.value === filter
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-white/20 text-white/70 hover:border-white/50 hover:text-white",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-12">
          <Carousel
            key={filter}
            autoplay={3800}
            itemClassName="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            items={items.map((project) => (
              <div key={project.title} className="h-full px-1 pb-1">
                <div className="group relative h-80 overflow-hidden rounded-3xl">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="relative flex h-full flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-full bg-white/15 text-lg text-white backdrop-blur-sm">
                        <i className={project.icon} aria-hidden="true" />
                      </span>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {project.tags.map((tag, tagIdx) => (
                          <span
                            key={`${tag}-${tagIdx}`}
                            className="rounded-full bg-white/15 px-2.5 py-1 text-[0.6rem] font-semibold tracking-wide text-white uppercase backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-heading text-xl font-bold text-white!">
                        <Link href="#" className="transition-colors hover:text-primary">
                          {project.title}
                        </Link>
                      </h4>
                      <p className="mt-1 text-sm text-white/70">{project.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          />
        </div>

        <Reveal direction="up">
          <div className="relative mt-16 overflow-hidden rounded-3xl bg-accent p-10 sm:p-14">
            <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-14">
              <p className="font-heading text-4xl font-bold text-primary sm:text-5xl">
                {PROJECTS.bottomBanner.stat}
              </p>
              <div>
                <h3 className="font-heading text-xl leading-snug font-bold text-white! sm:text-2xl">
                  {PROJECTS.bottomBanner.title[0]}
                  <br />
                  {PROJECTS.bottomBanner.title[1]}
                </h3>
                <ul className="mt-3 space-y-2">
                  {PROJECTS.bottomBanner.checklist.map((line) => (
                    <li key={line} className="flex items-center gap-2 text-sm text-white/80">
                      <i className="icon-check text-primary" aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <FindoxButton href="#" text={PROJECTS.bottomBanner.button} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
