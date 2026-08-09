import { SectionShell, Tag } from "./insight-ui";
import { UPDATES } from "./data";

/**
 * Updates — a dated changelog. The date lives in its own left column with
 * tabular figures so the dates line up vertically and the list can be scanned
 * by time, which is the only way anyone reads a regulatory feed.
 */
export function UpdatesSection({ index }: { index: number }) {
  return (
    <SectionShell
      id="updates"
      index={index}
      title="Updates"
      lede="Statutory and regulatory changes, summarised with the action they imply."
      count={`${UPDATES.length} recent`}
      action={{ label: "All updates", href: "/insight?filter=updates" }}
    >
      <ol className="divide-y divide-border/60 border-y border-border/60">
        {UPDATES.map((item) => (
          <li
            key={item.id}
            className="grid gap-x-8 gap-y-2 py-5 md:grid-cols-[10rem_minmax(0,1fr)] md:py-6"
          >
            <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
              <time
                dateTime={item.date}
                className="text-[13px] font-medium text-muted-foreground tabular-nums"
              >
                {item.date}
              </time>
              <Tag>{item.badge}</Tag>
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-[1.0625rem] leading-snug font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
