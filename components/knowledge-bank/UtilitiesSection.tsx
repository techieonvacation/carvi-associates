import { Reveal } from "@/components/site/Reveal";
import { UtilityCard } from "./UtilityCard";
import { SectionHeader } from "./SectionHeader";
import { ResourceGrid } from "./ResourceGrid";
import { UTILITIES } from "./data";

export function UtilitiesSection() {
  return (
    <section
      id="utilities"
      className="scroll-mt-28 py-16 md:py-20"
      aria-labelledby="utilities-heading"
    >
      <SectionHeader
        tagline="Everyday tools"
        title={["Utilities"]}
        description="Lightweight utilities for documents, data, and workflow polish."
      />
      <h2 id="utilities-heading" className="sr-only">
        Utilities
      </h2>
      <ResourceGrid columns={4}>
        {UTILITIES.map((item, index) => (
          <Reveal key={item.id} direction="up" delay={(index % 4) * 50} duration={900}>
            <UtilityCard item={item} />
          </Reveal>
        ))}
      </ResourceGrid>
    </section>
  );
}
