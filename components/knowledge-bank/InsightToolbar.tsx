"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  FILTER_CHIPS,
  TOTAL_RESOURCES,
  insightHref,
  type KnowledgeCategory,
} from "./data";
import { cn } from "@/lib/utils";

export function InsightToolbar({
  filter,
  value,
  onChange,
  inputRef,
}: {
  filter: KnowledgeCategory;
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="mb-12.5 flex flex-col gap-7.5 max-md:mb-10 max-md:gap-6">
      <div className="flex flex-wrap items-center gap-x-7.5 gap-y-4">
        <div className="relative w-full shrink-0 sm:w-105">
          <label htmlFor="insight-search" className="sr-only">
            Search the knowledge bank
          </label>
          <input
            ref={inputRef}
            id="insight-search"
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search articles, calculators, forms…"
            autoComplete="off"
            className="h-13.5 w-full border border-border bg-white pr-14 pl-6 text-[15px] text-foreground outline-none transition-colors duration-500 placeholder:text-muted-foreground/70 focus:border-accent"
          />
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-0 flex h-13.5 w-13.5 -translate-y-1/2 cursor-pointer items-center justify-center bg-accent text-white transition-colors duration-500 hover:bg-primary hover:text-foreground"
            >
              <X className="size-4.5" aria-hidden="true" />
            </button>
          ) : (
            <span
              className="pointer-events-none absolute top-1/2 right-0 flex h-13.5 w-13.5 -translate-y-1/2 items-center justify-center bg-accent text-white"
              aria-hidden="true"
            >
              <Search className="size-4.5" />
            </span>
          )}
        </div>

        <p className="text-[15px] text-muted-foreground max-sm:hidden">
          Search {TOTAL_RESOURCES} entries across the library — press{" "}
          <kbd className="mx-0.5 inline-flex items-center rounded border border-border bg-secondary/60 px-2 py-0.5 font-sans text-[13px] font-medium text-foreground">
            Ctrl
          </kbd>
          <kbd className="mx-0.5 inline-flex items-center rounded border border-border bg-secondary/60 px-2 py-0.5 font-sans text-[13px] font-medium text-foreground">
            K
          </kbd>{" "}
          from anywhere.
        </p>
      </div>

      <nav aria-label="Knowledge Bank categories">
        <ul className="m-0 flex list-none flex-wrap items-center gap-2.5 p-0">
          {FILTER_CHIPS.map((chip) => {
            const active = filter === chip.id;
            return (
              <li key={chip.id}>
                <Link
                  href={insightHref(chip.id)}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center border px-5 py-[9.5px] text-center font-heading text-[15px] font-semibold capitalize transition-all duration-500 hover:border-accent hover:bg-accent hover:text-white",
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-transparent text-muted-foreground",
                  )}
                >
                  {chip.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
