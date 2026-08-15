import Link from "next/link";
import { KnowledgeIcon } from "./icons";
import { ArrowButton, IconBadge, SectionShell, Tag, insightCard } from "./insight-ui";
import { CALCULATORS } from "./data";
import { cn } from "@/lib/utils";

export function CalculatorsSection() {
  const live = CALCULATORS.filter((item) => !item.comingSoon).length;

  return (
    <SectionShell
      id="calculators"
      tagline="Calculators"
      title="Working models, ready to use"
      lede="Tax, payroll, and financing calculators for the questions that come up every day."
      count={`${live} live · ${CALCULATORS.length - live} in build`}
    >
      <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2">
        {CALCULATORS.map((item) => {
          const body = (
            <>
              <div className="flex items-start justify-between gap-4">
                <IconBadge tone={item.comingSoon ? "muted" : "accent"}>
                  <KnowledgeIcon name={item.icon} className="size-5.5" />
                </IconBadge>
                {item.comingSoon ? <Tag>Coming soon</Tag> : <ArrowButton className="size-9" />}
              </div>
              <h3 className="mt-5 font-heading text-[19px] leading-[1.35] font-bold text-foreground transition-colors duration-500 group-hover:text-accent">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-[1.7] text-muted-foreground">
                {item.description}
              </p>
            </>
          );

          if (item.comingSoon) {
            return (
              <li
                key={item.id}
                className="flex h-full flex-col rounded-[20px] border border-dashed border-border bg-secondary/25 p-6 max-sm:p-5"
              >
                {body}
              </li>
            );
          }

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(insightCard, "group flex h-full flex-col p-6 max-sm:p-5")}
              >
                {body}
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
