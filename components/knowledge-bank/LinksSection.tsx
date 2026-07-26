import { Reveal } from "@/components/site/Reveal";
import { KnowledgeIcon } from "./icons";
import { SectionHeader } from "./SectionHeader";
import { LINKS, LINK_CATEGORIES } from "./data";

export function LinksSection() {
  return (
    <section
      id="links"
      className="scroll-mt-28 py-16 md:py-20"
      aria-labelledby="links-heading"
    >
      <SectionHeader
        tagline="Trusted portals"
        title={["Important Links"]}
        description="Government and business destinations, organized by the work you do."
      />
      <h2 id="links-heading" className="sr-only">
        Important Links
      </h2>

      <div className="space-y-10">
        {LINK_CATEGORIES.map((category) => {
          const items = LINKS.filter((link) => link.category === category);
          if (!items.length) return null;

          return (
            <div key={category}>
              <h3 className="mb-4 font-heading text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <Reveal key={item.id} direction="up" delay={index * 40} duration={850}>
                    <li className="flex flex-col gap-4 rounded-[18px] border border-border bg-card px-4 py-4 transition-colors hover:border-accent/40 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
                          <KnowledgeIcon name={item.icon} className="size-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading text-base font-bold text-foreground">
                            {item.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="findox-btn findox-btn--base shrink-0 self-start sm:self-center"
                      >
                        <span className="findox-btn__text">Open</span>
                        <span className="findox-btn__icon-box">
                          <span className="findox-btn__icon">
                            <i className="icon-arrow-right-up" aria-hidden="true" />
                            <i className="icon-arrow-right-up" aria-hidden="true" />
                          </span>
                        </span>
                      </a>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
