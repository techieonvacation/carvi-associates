"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/Reveal";
import { KnowledgeIcon } from "./icons";
import { SectionHeader } from "./SectionHeader";
import { ResourceGrid } from "./ResourceGrid";
import { SHORTS } from "./data";
import { cn } from "@/lib/utils";

export function ShortsSection() {
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  return (
    <section
      id="shorts"
      className="scroll-mt-28 rounded-[28px] border border-border/70 bg-secondary/40 px-4 py-16 sm:px-6 md:px-8 md:py-20"
      aria-labelledby="shorts-heading"
    >
      <SectionHeader
        tagline="30-second reads"
        title={["Shorts"]}
        description="Sharp takeaways for busy founders, CFOs, and compliance teams."
      />

      <ResourceGrid columns={3}>
        {SHORTS.map((item, index) => {
          const saved = !!bookmarked[item.id];
          return (
            <Reveal key={item.id} direction="up" delay={(index % 3) * 60} duration={900}>
              <article className="relative flex h-full flex-col rounded-[20px] border border-border bg-card p-5 md:p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Badge variant="outline">{item.category}</Badge>
                  <button
                    type="button"
                    aria-label={saved ? "Remove bookmark" : "Bookmark short"}
                    aria-pressed={saved}
                    onClick={() =>
                      setBookmarked((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }))
                    }
                    className={cn(
                      "rounded-full p-2 transition-colors",
                      saved
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <KnowledgeIcon name="bookmark" className="size-4" />
                  </button>
                </div>
                <h3
                  id={index === 0 ? "shorts-heading" : undefined}
                  className="mb-2 font-heading text-lg font-bold text-foreground"
                >
                  <Link href={item.href} className="hover:text-accent">
                    {item.title}
                  </Link>
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {item.preview}
                </p>
              </article>
            </Reveal>
          );
        })}
      </ResourceGrid>
    </section>
  );
}
