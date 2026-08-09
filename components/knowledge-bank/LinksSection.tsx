import { ExternalLink } from "lucide-react";
import { KnowledgeIcon } from "./icons";
import { Eyebrow, SectionShell } from "./insight-ui";
import { LINKS, LINK_CATEGORIES } from "./data";

/**
 * Links — outbound government and industry portals, grouped by the authority
 * that owns them. Each group is a labelled block so you can find "the income
 * tax one" by scanning headings rather than reading every row.
 */
export function LinksSection({ index }: { index: number }) {
  return (
    <SectionShell
      id="links"
      index={index}
      title="Important links"
      lede="Filing portals and official sources, grouped by the authority behind them."
      count={`${LINKS.length} portals`}
    >
      <div className="space-y-8">
        {LINK_CATEGORIES.map((category) => {
          const items = LINKS.filter((link) => link.category === category);
          if (!items.length) return null;

          return (
            <section key={category} aria-label={category}>
              <p className="mb-3 flex items-center gap-3">
                <Eyebrow>{category}</Eyebrow>
                <span className="h-px flex-1 bg-border/60" aria-hidden="true" />
                <span className="text-xs text-muted-foreground tabular-nums">
                  {items.length}
                </span>
              </p>
              <ul className="grid gap-2 md:grid-cols-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full items-start gap-3 rounded-lg border border-border/70 bg-card px-3.5 py-3 transition-colors hover:border-accent/45 hover:bg-secondary/30 focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none"
                    >
                      <KnowledgeIcon
                        name={item.icon}
                        className="mt-0.5 size-4 shrink-0 text-accent"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-sm font-bold text-foreground group-hover:text-accent">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                      <ExternalLink
                        className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70 group-hover:text-accent"
                        aria-hidden="true"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </SectionShell>
  );
}
