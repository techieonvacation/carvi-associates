"use client";

import { CountUp } from "@/components/site/CountUp";
import { Reveal } from "@/components/site/Reveal";
import { Container } from "@/components/site/Container";
import { SearchBar } from "./SearchBar";
import { STATS, categoryLabel, type KnowledgeCategory } from "./data";

function InsightVisual() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[420px]"
      aria-hidden="true"
    >
      <div className="absolute inset-[8%] animate-[fade-up_1.1s_cubic-bezier(0.16,1,0.3,1)_both] rounded-[36%] bg-gradient-to-br from-primary/55 via-secondary to-accent/35 blur-[1px]" />
      <div className="absolute inset-[18%] rounded-[32%] border border-border/70 bg-card/70 shadow-[0_30px_80px_-40px_rgba(58,48,32,0.55)] backdrop-blur-sm" />
      <div className="absolute inset-[28%] rounded-[28%] bg-gradient-to-tr from-accent/90 via-accent to-primary/80 shadow-[0_20px_50px_-20px_rgba(92,107,69,0.75)]" />
      <div className="absolute top-[14%] left-[18%] size-16 rounded-2xl border border-border/60 bg-card/90 shadow-lg" />
      <div className="absolute top-[22%] right-[12%] size-12 rounded-full border border-primary/50 bg-primary/80" />
      <div className="absolute right-[20%] bottom-[18%] h-14 w-24 rounded-2xl border border-border/50 bg-secondary/90" />
      <div className="absolute bottom-[24%] left-[14%] size-10 rounded-xl bg-accent/30" />
      <svg
        viewBox="0 0 320 320"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <path
          d="M48 210 C90 150, 130 250, 180 170 S260 90, 292 140"
          stroke="color-mix(in oklch, var(--accent) 55%, transparent)"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-80"
        />
        <circle cx="180" cy="170" r="5" fill="var(--primary)" />
        <circle cx="112" cy="188" r="4" fill="var(--accent)" />
        <circle
          cx="248"
          cy="128"
          r="4"
          fill="var(--foreground)"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}

export function Hero({
  filter,
  searchValue,
  onSearchChange,
  searchInputRef,
}: {
  filter: KnowledgeCategory;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const title = categoryLabel(filter);
  const subtitle =
    filter === "all"
      ? "One place for insights, calculators, forms, startup resources, legal information, business utilities, and much more."
      : `Browse curated ${title.toLowerCase()} from the Carvi Associates knowledge library.`;

  return (
    <section
      id="overview"
      className="relative overflow-hidden border-b border-border/60 bg-background pt-10 pb-12 md:pt-14 md:pb-16"
      aria-labelledby="insight-hero-title"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 15% 10%, color-mix(in oklch, var(--primary) 28%, transparent), transparent 60%), radial-gradient(ellipse 55% 45% at 90% 20%, color-mix(in oklch, var(--accent) 16%, transparent), transparent 55%), linear-gradient(180deg, color-mix(in oklch, var(--secondary) 55%, transparent), transparent 48%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative z-[1]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          <div>
            <Reveal direction="up" duration={900}>
              <p className="mb-4 inline-flex items-center gap-2 font-heading text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                <span
                  className="size-1.5 rounded-full bg-accent"
                  aria-hidden="true"
                />
                Knowledge Bank
              </p>
              <h1
                id="insight-hero-title"
                className="mb-4 font-heading text-4xl leading-[1.1] font-bold tracking-tight text-foreground sm:text-5xl md:text-[3.5rem]"
              >
                {title}
              </h1>
              <p className="mb-8 max-w-xl text-base text-muted-foreground md:text-lg">
                {subtitle}
              </p>
            </Reveal>

            <Reveal direction="up" delay={120} duration={900}>
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                inputRef={searchInputRef}
              />
            </Reveal>
          </div>

          <Reveal direction="left" delay={160} duration={1100}>
            <InsightVisual />
          </Reveal>
        </div>

        {filter === "all" ? (
          <Reveal direction="up" delay={220} duration={1000}>
            <ul className="mt-12 grid grid-cols-2 gap-[18px] sm:grid-cols-3 xl:grid-cols-6">
              {STATS.map((stat) => (
                <li
                  key={stat.id}
                  className="rounded-2xl border border-border/80 bg-card/85 px-4 py-4 shadow-[0_16px_40px_-34px_rgba(58,48,32,0.55)] backdrop-blur-sm"
                >
                  <p className="font-heading text-2xl font-bold text-foreground md:text-[1.75rem]">
                    <CountUp end={stat.value} duration={1600} />
                    {stat.suffix}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground md:text-sm">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
