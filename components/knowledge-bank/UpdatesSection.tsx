import { SectionHeader } from "./SectionHeader";
import { UpdateTimeline } from "./UpdateTimeline";
import { UPDATES } from "./data";

export function UpdatesSection() {
  return (
    <section
      id="updates"
      className="scroll-mt-28 py-16 md:py-20"
      aria-labelledby="updates-heading"
    >
      <SectionHeader
        tagline="Stay current"
        title={["Updates"]}
        description="Government, tax, startup, and regulatory changes — distilled for action."
      />
      <h2 id="updates-heading" className="sr-only">
        Updates
      </h2>
      <UpdateTimeline items={UPDATES} />
    </section>
  );
}
