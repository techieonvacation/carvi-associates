import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { KnowledgeIcon } from "./icons";
import type { CalculatorItem } from "./data";
import { cn } from "@/lib/utils";

export function CalculatorCard({ item }: { item: CalculatorItem }) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[20px] border border-border bg-card p-6 transition-all duration-400 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_22px_50px_-34px_rgba(58,48,32,0.45)]",
        item.comingSoon && "opacity-95",
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
          <KnowledgeIcon name={item.icon} className="size-5" />
        </span>
        {item.comingSoon ? (
          <Badge variant="secondary">Coming Soon</Badge>
        ) : null}
      </div>
      <h3 className="mb-2 font-heading text-lg font-bold text-foreground">
        {item.title}
      </h3>
      <p className="mb-6 flex-1 text-sm text-muted-foreground">
        {item.description}
      </p>
      {item.comingSoon ? (
        <span className="inline-flex h-10 items-center justify-center rounded-4xl border border-border bg-muted/40 px-4 text-sm font-medium text-muted-foreground">
          Notify me
        </span>
      ) : (
        <Link
          href={item.href}
          className="findox-btn findox-btn--base self-start"
        >
          <span className="findox-btn__text">Launch</span>
          <span className="findox-btn__icon-box">
            <span className="findox-btn__icon">
              <i className="icon-arrow-right-up" aria-hidden="true" />
              <i className="icon-arrow-right-up" aria-hidden="true" />
            </span>
          </span>
        </Link>
      )}
    </article>
  );
}
