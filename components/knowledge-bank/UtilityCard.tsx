import Link from "next/link";
import { KnowledgeIcon } from "./icons";
import type { UtilityItem } from "./data";

export function UtilityCard({ item }: { item: UtilityItem }) {
  return (
    <Link
      href={item.href}
      className="group flex h-full flex-col rounded-[18px] border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-secondary/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
    >
      <span className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
        <KnowledgeIcon name={item.icon} className="size-5" />
      </span>
      <h3 className="mb-1.5 font-heading text-base font-bold text-foreground">
        {item.title}
      </h3>
      <p className="mb-4 flex-1 text-sm text-muted-foreground">
        {item.description}
      </p>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
        Open tool
        <KnowledgeIcon
          name="arrow"
          className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </Link>
  );
}
