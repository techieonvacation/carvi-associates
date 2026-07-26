import { Reveal } from "@/components/site/Reveal";
import { CalculatorCard } from "./CalculatorCard";
import { SectionHeader } from "./SectionHeader";
import { ResourceGrid } from "./ResourceGrid";
import { CALCULATORS } from "./data";

export function CalculatorsSection() {
  return (
    <section
      id="calculators"
      className="scroll-mt-28 py-16 md:py-20"
      aria-labelledby="calculators-heading"
    >
      <SectionHeader
        tagline="Decision tools"
        title={["Calculators"]}
        description="Financial and compliance calculators built for everyday advisory work."
      />
      <h2 id="calculators-heading" className="sr-only">
        Calculators
      </h2>
      <ResourceGrid columns={3}>
        {CALCULATORS.map((item, index) => (
          <Reveal key={item.id} direction="up" delay={(index % 3) * 70} duration={950}>
            <CalculatorCard item={item} />
          </Reveal>
        ))}
      </ResourceGrid>
    </section>
  );
}
