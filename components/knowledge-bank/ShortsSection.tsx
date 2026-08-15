"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { SectionShell, Tag, insightCard } from "./insight-ui";
import { SHORTS } from "./data";
import { cn } from "@/lib/utils";

export function ShortsSection() {
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  return (
    <SectionShell
      id="shorts"
      tagline="Shorts"
      title="One idea, one minute"
      lede="Single takeaways from our advisory desk, written to be read between meetings."
      count={`${SHORTS.length} entries`}
    >
      <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-2">
        {SHORTS.map((item) => {
          const isSaved = Boolean(saved[item.id]);
          return (
            <li key={item.id}>
              <article
                className={cn(
                  insightCard,
                  "group flex h-full flex-col border-l-[3px] border-l-accent p-6 max-sm:p-5",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-heading text-[19px] leading-[1.35] font-bold text-foreground">
                    <Link
                      href={item.href}
                      className="transition-colors duration-500 hover:text-accent"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <button
                    type="button"
                    aria-pressed={isSaved}
                    aria-label={
                      isSaved ? `Remove bookmark on ${item.title}` : `Bookmark ${item.title}`
                    }
                    onClick={() => setSaved((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                    className={cn(
                      "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors duration-500",
                      isSaved
                        ? "border-accent bg-accent text-white"
                        : "border-border text-muted-foreground hover:border-accent hover:text-accent",
                    )}
                  >
                    <Bookmark className={cn("size-4", isSaved && "fill-current")} aria-hidden="true" />
                  </button>
                </div>

                <p className="mt-3 text-[15px] leading-[1.7] text-muted-foreground">
                  {item.preview}
                </p>
                <div className="mt-auto pt-5">
                  <Tag>{item.category}</Tag>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
