import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { KnowledgeIcon } from "./icons";
import { IconFrame, SectionShell, Tag } from "./insight-ui";
import { CALCULATORS } from "./data";

/**
 * Calculators — a tool directory. Each row is a target you click, so the row
 * itself is the control; unavailable tools stay in place as a muted, non-
 * interactive entry rather than being hidden, because knowing a tool is coming
 * is useful information.
 */
export function CalculatorsSection({ index }: { index: number }) {
  const live = CALCULATORS.filter((item) => !item.comingSoon).length;

  return (
    <SectionShell
      id="calculators"
      index={index}
      title="Calculators"
      lede="Working models for tax, payroll, and loan questions that come up daily."
      count={`${live} live · ${CALCULATORS.length - live} in build`}
    >
      <ul className="grid gap-3 md:grid-cols-2">
        {CALCULATORS.map((item) => {
          const body = (
            <>
              <IconFrame tone={item.comingSoon ? "muted" : "accent"}>
                <KnowledgeIcon name={item.icon} className="size-[1.125rem]" />
              </IconFrame>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-[0.9375rem] font-bold text-foreground">
                    {item.title}
                  </h3>
                  {item.comingSoon ? <Tag>Coming soon</Tag> : null}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </>
          );

          if (item.comingSoon) {
            return (
              <li
                key={item.id}
                className="flex gap-4 rounded-xl border border-dashed border-border/70 bg-secondary/20 px-4 py-4 sm:px-5"
              >
                {body}
              </li>
            );
          }

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex h-full gap-4 rounded-xl border border-border/70 bg-card px-4 py-4 transition-colors hover:border-accent/45 hover:bg-secondary/30 focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none sm:px-5"
              >
                {body}
                <ArrowUpRight
                  className="mt-2.5 size-4 shrink-0 self-start text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
