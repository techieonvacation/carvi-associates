import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "./SectionHeader";
import { ResourceGrid } from "./ResourceGrid";
import { FEATURED } from "./data";
import { cn } from "@/lib/utils";

const ACCENT_SURFACE: Record<(typeof FEATURED)[number]["accent"], string> = {
  primary:
    "bg-gradient-to-br from-primary/35 via-card to-card",
  accent:
    "bg-gradient-to-br from-accent/15 via-card to-card",
  secondary:
    "bg-gradient-to-br from-secondary via-card to-card",
};

export function FeaturedKnowledge() {
  return (
    <section
      id="featured"
      className="py-16 md:py-20"
      aria-labelledby="featured-heading"
    >
      <SectionHeader
        tagline="Curated for you"
        title={["Featured Knowledge"]}
        description="Start with what's trending — insights, tools, and rules our clients open most."
      />

      <ResourceGrid columns={2}>
        {FEATURED.map((item, index) => (
          <Reveal key={item.id} direction="up" delay={index * 80} duration={1000}>
            <article
              className={cn(
                "flex h-full flex-col rounded-[22px] border border-border p-6 md:p-7",
                ACCENT_SURFACE[item.accent],
              )}
            >
              <Badge variant="outline" className="mb-4 w-fit">
                {item.category}
              </Badge>
              <h3
                id={index === 0 ? "featured-heading" : undefined}
                className="mb-3 font-heading text-xl font-bold text-foreground md:text-2xl"
              >
                {item.title}
              </h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {item.meta}
                </p>
                <Link
                  href={item.href}
                  className="findox-btn findox-btn--base"
                >
                  <span className="findox-btn__text">Read</span>
                  <span className="findox-btn__icon-box">
                    <span className="findox-btn__icon">
                      <i className="icon-arrow-right-up" aria-hidden="true" />
                      <i className="icon-arrow-right-up" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </ResourceGrid>
    </section>
  );
}
