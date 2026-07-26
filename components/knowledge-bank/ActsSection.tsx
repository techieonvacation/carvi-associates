import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "./SectionHeader";
import { ResourceGrid } from "./ResourceGrid";
import { ACTS } from "./data";

function statusVariant(status: (typeof ACTS)[number]["status"]) {
  if (status === "In Force") return "default" as const;
  if (status === "Amended") return "secondary" as const;
  return "outline" as const;
}

export function ActsSection() {
  return (
    <section
      id="acts"
      className="scroll-mt-28 py-16 md:py-20"
      aria-labelledby="acts-heading"
    >
      <SectionHeader
        tagline="Legal library"
        title={["Acts & Rules"]}
        description="Core statutes and guidelines referenced across advisory and compliance work."
      />
      <h2 id="acts-heading" className="sr-only">
        Acts & Rules
      </h2>

      <ResourceGrid columns={3}>
        {ACTS.map((item, index) => (
          <Reveal key={item.id} direction="up" delay={(index % 3) * 60} duration={950}>
            <article className="flex h-full flex-col rounded-[20px] border border-border bg-card p-6">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                <span className="text-xs text-muted-foreground">
                  Updated {item.lastUpdated}
                </span>
              </div>
              <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                <Link href={item.href} className="hover:text-accent">
                  {item.title}
                </Link>
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </article>
          </Reveal>
        ))}
      </ResourceGrid>
    </section>
  );
}
