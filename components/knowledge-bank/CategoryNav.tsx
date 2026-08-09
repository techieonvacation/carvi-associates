"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { FILTER_CHIPS, insightHref, type KnowledgeCategory } from "./data";
import { cn } from "@/lib/utils";

/**
 * CategoryNav — sticky category switcher. Desktop gets an underlined tab rail;
 * phones get a native select instead of a horizontal chip scroller, because
 * hunting sideways for an off-screen chip is the worst way to change a filter
 * on a small screen.
 */
export function CategoryNav({ active }: { active: KnowledgeCategory }) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="py-2.5 md:hidden">
          <label htmlFor="insight-category" className="sr-only">
            Choose a category
          </label>
          <div className="relative">
            <select
              id="insight-category"
              value={active}
              onChange={(event) =>
                router.push(insightHref(event.target.value as KnowledgeCategory), {
                  scroll: false,
                })
              }
              className="h-10 w-full appearance-none rounded-lg border border-border/70 bg-card pr-10 pl-3 text-sm font-medium text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35"
            >
              {FILTER_CHIPS.map((chip) => (
                <option key={chip.id} value={chip.id}>
                  {chip.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>

        <nav aria-label="Knowledge Bank categories" className="hidden md:block">
          <ul className="-mb-px flex flex-wrap items-center gap-x-1">
            {FILTER_CHIPS.map((chip) => {
              const isActive = active === chip.id;
              return (
                <li key={chip.id}>
                  <Link
                    href={insightHref(chip.id)}
                    scroll={false}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex h-11 items-center border-b-2 px-3 text-sm transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none",
                      isActive
                        ? "border-accent font-semibold text-accent"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
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
    </div>
  );
}
