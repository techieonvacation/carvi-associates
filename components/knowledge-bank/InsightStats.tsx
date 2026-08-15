import { Container } from "@/components/site/Container";
import { CountUp } from "@/components/site/CountUp";
import { STATS } from "./data";

export function InsightStats() {
  return (
    <section aria-label="Library at a glance" className="border-b border-border bg-secondary/35">
      <Container>
        <dl className="grid grid-cols-2 divide-border max-md:gap-y-px sm:grid-cols-3 md:divide-x lg:grid-cols-6">
          {STATS.map((stat) => (
            <div key={stat.id} className="px-2 py-8 text-center max-md:py-6">
              <dd className="font-heading text-[34px] leading-none font-bold text-foreground max-sm:text-[28px]">
                <CountUp end={stat.value} />
                {stat.suffix}
              </dd>
              <dt className="mt-2.5 text-[15px] leading-snug text-muted-foreground max-sm:text-sm">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
