import { Reveal } from "@/components/site/Reveal";
import { KnowledgeIcon } from "./icons";
import { SectionHeader } from "./SectionHeader";
import { ResourceGrid } from "./ResourceGrid";
import { FORMS } from "./data";

export function FormsSection() {
  return (
    <section
      id="forms"
      className="scroll-mt-28 py-16 md:py-20"
      aria-labelledby="forms-heading"
    >
      <SectionHeader
        tagline="Ready to file"
        title={["Forms"]}
        description="Downloadable packs for registration, tax, and statutory workflows."
      />
      <h2 id="forms-heading" className="sr-only">
        Forms
      </h2>

      <ResourceGrid columns={4}>
        {FORMS.map((item, index) => (
          <Reveal key={item.id} direction="up" delay={(index % 4) * 50} duration={900}>
            <article className="flex h-full flex-col rounded-[20px] border border-border bg-card p-5 md:p-6">
              <span className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <KnowledgeIcon name={item.icon} className="size-5" />
              </span>
              <h3 className="mb-1.5 font-heading text-base font-bold text-foreground md:text-lg">
                {item.title}
              </h3>
              <p className="mb-5 flex-1 text-sm text-muted-foreground">
                {item.description}
              </p>
              <a
                href={item.href}
                className="inline-flex items-center justify-center gap-2 rounded-4xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
              >
                <KnowledgeIcon name="download" className="size-4" />
                Download
              </a>
            </article>
          </Reveal>
        ))}
      </ResourceGrid>
    </section>
  );
}
