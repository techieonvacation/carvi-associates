import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/Reveal";
import type { UpdateItem } from "./data";

export function UpdateTimeline({ items }: { items: UpdateItem[] }) {
  return (
    <ol className="relative space-y-0 border-l border-border/80 pl-6 md:pl-8">
      {items.map((item, index) => (
        <Reveal key={item.id} direction="up" delay={index * 60} duration={900}>
          <li className="relative pb-8 last:pb-0">
            <span
              className="absolute top-1.5 -left-[1.9rem] size-3 rounded-full border-2 border-card bg-accent shadow-[0_0_0_4px_color-mix(in_oklch,var(--accent)_18%,transparent)] md:-left-[2.4rem]"
              aria-hidden="true"
            />
            <div className="rounded-[18px] border border-border/80 bg-card/80 p-5 transition-colors hover:border-accent/40 md:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <time
                  dateTime={item.date}
                  className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                >
                  {item.date}
                </time>
                <Badge variant="outline">{item.badge}</Badge>
              </div>
              <h3 className="mb-2 font-heading text-lg font-bold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.summary}
              </p>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
