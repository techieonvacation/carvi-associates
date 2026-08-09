"use client";

import Link from "next/link";
import { QUICK_ACCESS, insightHref, type KnowledgeCategory } from "./data";
import { Eyebrow } from "./insight-ui";
import { cn } from "@/lib/utils";

/** Section order on the "all" view, mirrored by the rail's jump links. */
const SECTIONS = [
  { id: "featured", label: "Featured" },
  { id: "insights", label: "Insights" },
  { id: "shorts", label: "Shorts" },
  { id: "calculators", label: "Calculators" },
  { id: "updates", label: "Updates" },
  { id: "utilities", label: "Utilities" },
  { id: "links", label: "Links" },
  { id: "acts", label: "Acts & rules" },
  { id: "forms", label: "Forms" },
];

/**
 * CategoryRail — an on-page table of contents for the long "all" view. It jumps
 * within the page rather than re-navigating, which is what a rail beside a long
 * document should do; the header nav already handles filtering.
 */
export function CategoryRail({ filter }: { filter: KnowledgeCategory }) {
  if (filter !== "all") return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-24 hidden w-48 shrink-0 self-start xl:block"
    >
      <p className="mb-3">
        <Eyebrow>On this page</Eyebrow>
      </p>
      <ol className="space-y-0.5 border-l border-border/60">
        {SECTIONS.map((section, position) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="group -ml-px flex items-baseline gap-2 border-l-2 border-transparent py-1.5 pl-3 text-[13px] text-muted-foreground transition-colors hover:border-accent hover:text-foreground focus-visible:border-accent focus-visible:text-foreground focus-visible:outline-none"
            >
              <span
                className="text-[11px] text-muted-foreground/60 tabular-nums"
                aria-hidden="true"
              >
                {(position + 1).toString().padStart(2, "0")}
              </span>
              {section.label}
            </a>
          </li>
        ))}
      </ol>

      <p className="mt-6 mb-3">
        <Eyebrow>Jump to category</Eyebrow>
      </p>
      <ul className="space-y-0.5">
        {QUICK_ACCESS.map((item) => (
          <li key={item.id}>
            <Link
              href={insightHref(item.id as KnowledgeCategory)}
              scroll={false}
              className={cn(
                "flex items-baseline justify-between gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              {item.title}
              <span className="text-[11px] tabular-nums">{item.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
