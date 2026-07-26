import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "./SectionHeader";
import { ResourceGrid } from "./ResourceGrid";
import { INSIGHTS } from "./data";
import { cn } from "@/lib/utils";

const COVER_TONES = [
  "from-accent/70 via-accent/40 to-primary/50",
  "from-primary/70 via-secondary to-accent/40",
  "from-secondary via-primary/50 to-accent/55",
  "from-accent/50 via-card to-primary/60",
];

export function InsightsSection() {
  return (
    <section
      id="insights"
      className="scroll-mt-28 py-16 md:py-20"
      aria-labelledby="insights-heading"
    >
      <SectionHeader
        tagline="Deep dives"
        title={["Insights"]}
        description="Research-backed articles across market, funding, operations, and technology."
      />

      <ResourceGrid columns={3}>
        {INSIGHTS.map((item, index) => (
          <Reveal key={item.id} direction="up" delay={(index % 3) * 70} duration={950}>
            <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_22px_50px_-34px_rgba(58,48,32,0.5)]">
              <div
                className={cn(
                  "relative aspect-[16/10] bg-gradient-to-br",
                  COVER_TONES[index % COVER_TONES.length],
                )}
                aria-hidden="true"
              >
                <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_30%,white_0_1px,transparent_1.5px)] [background-size:18px_18px]" />
                <span className="absolute right-4 bottom-4 font-heading text-4xl font-black text-white/25">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <Badge variant="secondary" className="mb-3 w-fit">
                  {item.category}
                </Badge>
                <h3
                  id={index === 0 ? "insights-heading" : undefined}
                  className="mb-2 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent md:text-xl"
                >
                  <Link href={item.href}>{item.title}</Link>
                </h3>
                <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
                  {item.summary}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{item.readingTime} read</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.views} views</span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ResourceGrid>
    </section>
  );
}
