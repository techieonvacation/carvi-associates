"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ABOUT } from "./home-data";

export function About() {
  const [activeTab, setActiveTab] = useState(ABOUT.tabs[1].id);
  const tab = ABOUT.tabs.find((t) => t.id === activeTab) ?? ABOUT.tabs[0];

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-16 pb-12 sm:pb-20 lg:grid-cols-2 lg:gap-12">
          <Reveal direction="left">
            <div className="relative pb-16 sm:pb-24">
              <div className="relative aspect-4/5 w-[80%] overflow-hidden rounded-3xl">
                <Image
                  src={ABOUT.images.collageOne}
                  alt="Advisors reviewing a financial plan"
                  fill
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute right-0 bottom-0 w-[58%]">
                <div className="relative aspect-square overflow-hidden rounded-3xl border-8 border-background shadow-xl">
                  <Image
                    src={ABOUT.images.collageTwo}
                    alt="Client consultation in progress"
                    fill
                    sizes="(min-width: 1024px) 20vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-8 -left-8 rounded-2xl bg-accent px-5 py-4 text-white shadow-lg sm:-left-12">
                  <p className="font-heading text-2xl font-bold sm:text-3xl">
                    {ABOUT.experience.value}
                  </p>
                  <p className="text-[0.65rem] font-semibold tracking-wide uppercase sm:text-xs">
                    {ABOUT.experience.label}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading tagline={ABOUT.tagline} lines={ABOUT.title} />
            <Reveal direction="up" delay={100}>
              <p className="mt-6 text-muted-foreground">{ABOUT.text}</p>
            </Reveal>

            <Reveal direction="up" delay={200}>
              <div className="mt-8">
                <div className="flex flex-wrap gap-2 border-b border-border">
                  {ABOUT.tabs.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id)}
                      className={cn(
                        "-mb-px rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
                        t.id === activeTab
                          ? "border-accent text-accent"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto]">
                  <ul className="space-y-3">
                    {ABOUT.checklist.map((line) => (
                      <li key={line} className="flex items-center gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs text-accent">
                          <i className="icon-check" aria-hidden="true" />
                        </span>
                        <Link href="#" className="text-sm font-medium text-foreground hover:text-accent">
                          {line}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="relative hidden size-28 shrink-0 overflow-hidden rounded-2xl sm:block">
                    <Image src={tab.image} alt={tab.label} fill sizes="112px" className="object-cover" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
