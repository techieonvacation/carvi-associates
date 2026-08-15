import { SectionShell, Tag } from "./insight-ui";
import { UPDATES } from "./data";

export function UpdatesSection() {
  return (
    <SectionShell
      id="updates"
      tagline="Updates"
      title="What changed, and what it means"
      lede="Statutory and regulatory movement, summarised with the action it implies for your business."
      count={`${UPDATES.length} recent`}
      action={{ label: "All updates", href: "/insight?filter=updates" }}
    >
      <ol className="m-0 list-none overflow-hidden rounded-[20px] border border-border bg-white p-0">
        {UPDATES.map((item) => (
          <li
            key={item.id}
            className="insight-row grid gap-x-8 gap-y-3 border-b border-border/60 p-7.5 last:border-b-0 hover:bg-secondary/30 md:grid-cols-[10.5rem_minmax(0,1fr)] max-sm:p-5"
          >
            <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-start">
              <time
                dateTime={item.date}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground tabular-nums"
              >
                <i className="icon-calendar text-xs text-accent" aria-hidden="true" />
                {item.date}
              </time>
              <Tag>{item.badge}</Tag>
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-[19px] leading-[1.35] font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-[1.7] text-muted-foreground">
                {item.summary}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
