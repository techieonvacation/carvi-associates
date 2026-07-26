import { FindoxButton } from "@/components/site/FindoxButton";
import { Reveal } from "@/components/site/Reveal";

export function CTASection() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden rounded-[28px] border border-border bg-accent px-6 py-14 text-accent-foreground sm:px-10 md:px-14 md:py-16"
      aria-labelledby="kb-cta-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, color-mix(in oklch, var(--primary) 70%, transparent), transparent 42%), radial-gradient(circle at 85% 80%, color-mix(in oklch, var(--secondary) 55%, transparent), transparent 45%)",
        }}
        aria-hidden="true"
      />
      <Reveal direction="up" duration={1000}>
        <div className="relative z-[1] mx-auto max-w-3xl text-center">
          <h2
            id="kb-cta-title"
            className="mb-4 font-heading text-3xl font-bold text-white md:text-4xl"
          >
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="mb-8 text-base text-white/85 md:text-lg">
            Search our complete knowledge repository or contact us — our team
            will point you to the right resource.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <FindoxButton href="/insight" text="Explore Insights" variant="base" />
            <FindoxButton href="/#contact" text="Contact Us" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
