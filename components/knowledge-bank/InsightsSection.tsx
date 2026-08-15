import Link from "next/link";
import { ArrowButton, SectionShell, Tag, insightCard } from "./insight-ui";
import { INSIGHTS } from "./data";
import { cn } from "@/lib/utils";

export function InsightsSection() {
  return (
    <SectionShell
      id="insights"
      tagline="Insights"
      title="Long-form analysis"
      lede="Deep dives on funding, market structure, operations, and technology — written for founders and finance teams."
      count={`${INSIGHTS.length} articles`}
      action={{ label: "All insights", href: "/insight?filter=insights" }}
    >
      <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-2">
        {INSIGHTS.map((item) => (
          <li key={item.id}>
            <article className={cn(insightCard, "group flex h-full flex-col p-7.5 max-sm:p-5")}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Tag>{item.category}</Tag>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <i className="icon-clock text-xs text-accent" aria-hidden="true" />
                  {item.readingTime} read
                </span>
              </div>

              <h3 className="mt-5 font-heading text-[22px] leading-[1.3] font-bold text-foreground max-sm:text-[20px]">
                <Link
                  href={item.href}
                  className="transition-colors duration-500 hover:text-accent"
                >
                  {item.title}
                </Link>
              </h3>
              <p className="mt-3.5 text-base leading-[1.75] text-muted-foreground">
                {item.summary}
              </p>

              <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/60 pt-6 max-sm:pt-5">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <i className="icon-eye text-xs text-accent" aria-hidden="true" />
                  {item.views} views
                </span>
                <Link href={item.href} aria-label={`Read ${item.title}`}>
                  <ArrowButton />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
