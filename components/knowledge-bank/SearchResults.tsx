"use client";

import Link from "next/link";
import { ArrowUpRight, SearchX } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Eyebrow, Tag } from "./insight-ui";
import { categoryLabel, type SearchableItem } from "./data";

export function SearchResults({
  query,
  results,
  onClear,
}: {
  query: string;
  results: SearchableItem[];
  onClear: () => void;
}) {
  if (!query.trim()) return null;

  return (
    <Container className="py-10 md:py-12">
      <div
        className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
        aria-live="polite"
      >
        <p className="min-w-0">
          <Eyebrow>Search</Eyebrow>
          <span className="mt-1.5 block font-heading text-lg font-bold text-foreground">
            {results.length} {results.length === 1 ? "result" : "results"} for
            &ldquo;{query.trim()}&rdquo;
          </span>
        </p>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-sm font-medium text-accent hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none"
        >
          Clear search
        </button>
      </div>

      {results.length ? (
        <ul className="mt-6 divide-y divide-border/60 border-y border-border/60">
          {results.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex items-start justify-between gap-4 py-4 focus-visible:outline-none"
              >
                <div className="min-w-0">
                  <h3 className="font-heading text-[0.9375rem] font-bold text-foreground group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-2">
                    <Tag>{categoryLabel(item.category)}</Tag>
                  </div>
                </div>
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-xl border border-dashed border-border/70 bg-secondary/20 px-5 py-8">
          <SearchX className="size-5 text-muted-foreground" aria-hidden="true" />
          <p className="font-heading text-[0.9375rem] font-bold text-foreground">
            Nothing matched &ldquo;{query.trim()}&rdquo;
          </p>
          <p className="max-w-md text-[13px] leading-relaxed text-muted-foreground">
            Try a shorter term, or browse a category from the list above — the
            library indexes titles and summaries, not full article text.
          </p>
        </div>
      )}
    </Container>
  );
}
