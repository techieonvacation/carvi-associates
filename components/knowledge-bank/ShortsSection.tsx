"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { SectionShell, Tag } from "./insight-ui";
import { SHORTS } from "./data";
import { cn } from "@/lib/utils";

/**
 * Shorts — single takeaways, so each one is set as a marked passage: an accent
 * rule down the left edge, the claim at reading size, the source category
 * underneath. Two columns keeps the measure short enough to scan.
 */
export function ShortsSection({ index }: { index: number }) {
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  return (
    <SectionShell
      id="shorts"
      index={index}
      title="Shorts"
      lede="One idea each, written to be read between meetings."
      count={`${SHORTS.length} entries`}
    >
      <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
        {SHORTS.map((item) => {
          const isSaved = Boolean(saved[item.id]);
          return (
            <li
              key={item.id}
              className="group flex items-start gap-4 border-l-2 border-border py-4 pl-4 transition-colors hover:border-accent sm:pl-5"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-[0.9375rem] leading-snug font-bold text-foreground">
                  <Link href={item.href} className="hover:text-accent">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {item.preview}
                </p>
                <div className="mt-2.5">
                  <Tag>{item.category}</Tag>
                </div>
              </div>
              <button
                type="button"
                aria-label={isSaved ? `Remove bookmark on ${item.title}` : `Bookmark ${item.title}`}
                aria-pressed={isSaved}
                onClick={() =>
                  setSaved((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                }
                className={cn(
                  "shrink-0 rounded-md p-1.5 transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none",
                  isSaved
                    ? "text-accent"
                    : "text-muted-foreground/50 hover:bg-secondary hover:text-foreground",
                )}
              >
                <Bookmark
                  className={cn("size-4", isSaved && "fill-current")}
                  aria-hidden="true"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
