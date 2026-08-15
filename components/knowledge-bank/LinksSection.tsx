import { KnowledgeIcon } from "./icons";
import { IconBadge, SectionShell, insightCard } from "./insight-ui";
import { LINKS, LINK_CATEGORIES } from "./data";
import { cn } from "@/lib/utils";

export function LinksSection() {
  return (
    <SectionShell
      id="links"
      tagline="Important links"
      title="Every portal you file on"
      lede="Official filing portals and primary sources, grouped by the authority that owns them."
      count={`${LINKS.length} portals`}
    >
      <div className="flex flex-col gap-10">
        {LINK_CATEGORIES.map((category) => {
          const items = LINKS.filter((link) => link.category === category);
          if (!items.length) return null;

          return (
            <section key={category} aria-label={category}>
              <div className="mb-5 flex items-center gap-4">
                <h3 className="font-heading text-[15px] font-semibold tracking-[0.14em] text-accent uppercase">
                  {category}
                </h3>
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
                <span className="text-sm text-muted-foreground tabular-nums">
                  {items.length}
                </span>
              </div>

              <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        insightCard,
                        "group flex h-full items-start gap-4 p-5 max-sm:p-4.5",
                      )}
                    >
                      <IconBadge className="size-11">
                        <KnowledgeIcon name={item.icon} className="size-5" />
                      </IconBadge>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-[17px] leading-snug font-bold text-foreground transition-colors duration-500 group-hover:text-accent">
                          {item.title}
                        </span>
                        <span className="mt-1.5 block text-sm leading-[1.6] text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                      <i
                        className="icon-arrow-right-up mt-1 shrink-0 text-[11px] text-muted-foreground transition-all duration-500 group-hover:-translate-y-0.5 group-hover:text-accent"
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
