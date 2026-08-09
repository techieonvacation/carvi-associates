"use client";

import Link from "next/link";
import { Container } from "@/components/site/Container";
import { KnowledgeIcon } from "./icons";
import { SearchBar } from "./SearchBar";
import { Dot, Eyebrow } from "./insight-ui";
import {
  LAST_UPDATED,
  QUICK_ACCESS,
  STATS,
  TOTAL_RESOURCES,
  categoryLabel,
  type KnowledgeCategory,
} from "./data";

/**
 * Masthead — an editorial page head, not a marketing hero. Left column states
 * what the page is and gives you the search box; right column is a real index
 * of the library with live counts, so the largest element on screen is useful
 * rather than decorative.
 */
export function Masthead({
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
  const lede =
    filter === "all"
      ? "Reference material for founders, finance teams, and compliance staff — articles, calculators, statutory forms, acts, and the portals you file on."
      : `Every ${title.toLowerCase()} entry in the Carvi Associates library, most recent first.`;

  return (
    <section
      id="overview"
      className="border-b border-border/60 bg-secondary/25"
      aria-labelledby="insight-masthead-title"
    >
      <Container className="py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20.5rem] lg:gap-14">
          <div className="min-w-0">
            <Eyebrow>Knowledge Bank</Eyebrow>
            <h1
              id="insight-masthead-title"
              className="mt-3 font-heading text-[2.125rem] leading-[1.08] font-bold tracking-tight text-foreground sm:text-[2.75rem] lg:text-[3.25rem]"
            >
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground md:text-base">
              {lede}
            </p>

            <div className="mt-7 max-w-xl">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                inputRef={searchInputRef}
              />
            </div>

            <dl className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-muted-foreground">
              {STATS.slice(0, 3).map((stat, index) => (
                <div key={stat.id} className="flex items-center gap-3">
                  {index > 0 ? <Dot /> : null}
                  <div className="flex items-baseline gap-1.5">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-heading font-semibold text-foreground tabular-nums">
                      {stat.value}
                      {stat.suffix}
                    </dd>
                    <span aria-hidden="true">{stat.label.toLowerCase()}</span>
                  </div>
                </div>
              ))}
              <Dot />
              <div className="flex items-baseline gap-1.5">
                <dt className="sr-only">Last updated</dt>
                <dd>
                  updated{" "}
                  <span className="font-medium text-foreground">{LAST_UPDATED}</span>
                </dd>
              </div>
            </dl>
          </div>

          <nav
            aria-label="Library contents"
            className="rounded-xl border border-border/70 bg-card"
          >
            <p className="border-b border-border/60 px-5 py-3">
              <Eyebrow>
                Contents · {TOTAL_RESOURCES.toLocaleString("en-IN")} entries
              </Eyebrow>
            </p>
            <ul>
              {QUICK_ACCESS.map((item) => {
                const active = filter === item.id;
                return (
                  <li key={item.id} className="border-b border-border/50 last:border-b-0">
                    <Link
                      href={item.href}
                      scroll={false}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-center gap-3 px-5 py-[0.6875rem] transition-colors hover:bg-secondary/40 focus-visible:bg-secondary/40 focus-visible:outline-none"
                    >
                      <KnowledgeIcon
                        name={item.icon}
                        className="size-4 shrink-0 text-accent"
                      />
                      <span
                        className={
                          active
                            ? "flex-1 text-sm font-semibold text-accent"
                            : "flex-1 text-sm text-foreground/85 group-hover:text-foreground"
                        }
                      >
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {item.count}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
