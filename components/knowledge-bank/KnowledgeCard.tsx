import Link from "next/link";
import { KnowledgeIcon } from "./icons";
import { cn } from "@/lib/utils";
import type { QuickAccessItem } from "./data";

export function KnowledgeCard({
  item,
  className,
}: {
  item: QuickAccessItem;
  className?: string;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_24px_60px_-36px_rgba(92,107,69,0.55)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
        className,
      )}
    >
      <span
        className="pointer-events-none absolute -top-12 -right-10 size-36 rounded-full bg-accent/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--primary) 35%, transparent), transparent 55%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-[1] mb-5 flex items-start justify-between gap-3">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-[0_12px_30px_-16px_rgba(92,107,69,0.9)] transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
          <KnowledgeIcon name={item.icon} className="size-6" />
        </span>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {item.count}+
        </span>
      </div>

      <div className="relative z-[1] flex flex-1 flex-col">
        <h3 className="mb-2 font-heading text-xl font-bold text-foreground transition-colors group-hover:text-accent">
          {item.title}
        </h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          Explore
          <KnowledgeIcon
            name="arrow"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
