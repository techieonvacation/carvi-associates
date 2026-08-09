import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionShell, Tag } from "./insight-ui";
import { FEATURED } from "./data";

/**
 * Featured — a lead entry at editorial size followed by three compact ones.
 * Asymmetry does the work that a uniform grid of four equal cards cannot: it
 * tells you where to look first.
 */
export function FeaturedKnowledge({ index }: { index: number }) {
  const [lead, ...rest] = FEATURED;
  if (!lead) return null;

  return (
    <SectionShell
      id="featured"
      index={index}
      title="Featured this week"
      lede="What clients opened most across the library over the last seven days."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-6">
        <Link
          href={lead.href}
          className="group flex flex-col justify-between rounded-xl border border-border/70 bg-accent p-6 text-accent-foreground transition-colors hover:bg-accent/92 focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none md:p-8"
        >
          <div>
            <span className="inline-flex items-center rounded-md border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/90">
              {lead.category}
            </span>
            <h3 className="mt-5 font-heading text-[1.5rem] leading-snug font-bold text-white md:text-[1.875rem]">
              {lead.title}
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 md:text-[0.9375rem]">
              {lead.description}
            </p>
          </div>
          <p className="mt-8 flex items-center gap-2 text-[13px] font-medium text-white/75">
            {lead.meta}
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </p>
        </Link>

        <ul className="grid gap-3 content-start">
          {rest.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex items-start justify-between gap-4 rounded-xl border border-border/70 bg-card px-5 py-4 transition-colors hover:border-accent/45 hover:bg-secondary/30 focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none"
              >
                <div className="min-w-0">
                  <Tag>{item.category}</Tag>
                  <h3 className="mt-2.5 font-heading text-base leading-snug font-bold text-foreground group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-2 text-[11px] tracking-wide text-muted-foreground uppercase">
                    {item.meta}
                  </p>
                </div>
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
