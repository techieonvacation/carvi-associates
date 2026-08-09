import Link from "next/link";
import { Dot, SectionShell, Tag } from "./insight-ui";
import { INSIGHTS } from "./data";

/**
 * Insights — an article index, laid out like one. Rows separated by hairlines
 * with a running number, category, reading time and views. No invented cover
 * art: a gradient rectangle standing in for a photo adds nothing a reader can
 * use, and four of them in a row is the giveaway that nobody designed the page.
 */
export function InsightsSection({ index }: { index: number }) {
  return (
    <SectionShell
      id="insights"
      index={index}
      title="Insights"
      lede="Long-form analysis on funding, market structure, operations, and technology."
      count={`${INSIGHTS.length} articles`}
      action={{ label: "All insights", href: "/insight?filter=insights" }}
    >
      <ol className="divide-y divide-border/60 border-y border-border/60">
        {INSIGHTS.map((item, position) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="group grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-4 py-5 transition-colors focus-visible:outline-none sm:grid-cols-[2.5rem_minmax(0,1fr)] md:py-6"
            >
              <span
                className="font-heading text-sm font-semibold text-muted-foreground/70 tabular-nums group-hover:text-primary"
                aria-hidden="true"
              >
                {(position + 1).toString().padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-heading text-[1.0625rem] leading-snug font-bold text-foreground group-hover:text-accent md:text-[1.1875rem]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                  <Tag>{item.category}</Tag>
                  <span className="tabular-nums">{item.readingTime} read</span>
                  <Dot />
                  <span className="tabular-nums">{item.views} views</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
