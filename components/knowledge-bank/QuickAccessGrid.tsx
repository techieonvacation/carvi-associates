import { Reveal } from "@/components/site/Reveal";
import { KnowledgeCard } from "./KnowledgeCard";
import { SectionHeader } from "./SectionHeader";
import { ResourceGrid } from "./ResourceGrid";
import { QUICK_ACCESS } from "./data";

export function QuickAccessGrid() {
  return (
    <section
      className="py-16 md:py-20"
      aria-labelledby="quick-access-heading"
    >
      <SectionHeader
        tagline="Jump in"
        title={["Browse Categories"]}
        description="Open any Knowledge Bank category — each view is filtered on /insight."
      />
      <h2 id="quick-access-heading" className="sr-only">
        Browse Categories
      </h2>
      <ResourceGrid columns={4}>
        {QUICK_ACCESS.map((item, index) => (
          <Reveal key={item.id} direction="up" delay={(index % 4) * 70} duration={1000}>
            <KnowledgeCard item={item} />
          </Reveal>
        ))}
      </ResourceGrid>
    </section>
  );
}
