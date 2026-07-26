"use client";

import Link from "next/link";
import { FILTER_CHIPS, insightHref, type KnowledgeCategory } from "./data";
import { cn } from "@/lib/utils";

export function FilterBar({
  active,
  sticky = true,
}: {
  active: KnowledgeCategory;
  sticky?: boolean;
}) {
  return (
    <div
      className={cn(
        "z-30 border-y border-border/70 bg-background/85 backdrop-blur-md",
        sticky && "sticky top-[88px]",
      )}
      role="navigation"
      aria-label="Insight categories"
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-2 overflow-x-auto px-4 py-3 scrollbar-hide sm:px-6">
        {FILTER_CHIPS.map((chip) => {
          const isActive = active === chip.id;
          return (
            <Link
              key={chip.id}
              href={insightHref(chip.id)}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {chip.label}
              {isActive ? (
                <span
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
