import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared primitives for the Knowledge Bank. The page is a reference library,
 * not a landing page, so the system is deliberately narrow: one border weight,
 * one radius, one label style, no decorative gradients. Structure varies per
 * content type; chrome does not.
 */

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-heading text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Numbered section header: `03 — Calculators`, a count, and an optional link. */
export function SectionShell({
  id,
  index,
  title,
  lede,
  count,
  action,
  children,
  className,
}: {
  id: string;
  index: number;
  title: string;
  lede: string;
  count?: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
}) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "scroll-mt-24 border-t border-border/60 py-12 first:border-t-0 md:py-16",
        className,
      )}
    >
      <header className="mb-8 md:mb-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div className="flex min-w-0 items-baseline gap-3">
            <span
              className="font-heading text-sm font-semibold text-primary tabular-nums"
              aria-hidden="true"
            >
              {index.toString().padStart(2, "0")}
            </span>
            <h2
              id={headingId}
              className="font-heading text-[1.375rem] leading-tight font-bold tracking-tight text-foreground md:text-[1.625rem]"
            >
              {title}
            </h2>
            {count ? (
              <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
            ) : null}
          </div>
          {action ? (
            <Link
              href={action.href}
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              {action.label}
              <ArrowUpRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          ) : null}
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
          {lede}
        </p>
      </header>
      {children}
    </section>
  );
}

/** Small status/category label. Flat, bordered, no fill — reads as metadata. */
export function Tag({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent" | "primary";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        tone === "muted" && "border-border/70 bg-secondary/50 text-muted-foreground",
        tone === "accent" && "border-accent/30 bg-accent/8 text-accent",
        tone === "primary" && "border-primary/60 bg-primary/25 text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Middot separator for inline metadata runs. */
export function Dot() {
  return (
    <span className="text-border" aria-hidden="true">
      ·
    </span>
  );
}

/** The one card surface used across the page. */
export const cardSurface =
  "rounded-xl border border-border/70 bg-card transition-colors duration-200";

/** The one interactive-row surface used across the page. */
export const rowSurface =
  "group flex gap-4 rounded-xl border border-border/70 bg-card px-4 py-4 transition-colors duration-200 hover:border-accent/45 hover:bg-secondary/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none sm:px-5";

/** Square icon frame at a single size, used for every tool/link/form row. */
export function IconFrame({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-lg",
        tone === "muted" && "bg-secondary/70 text-accent",
        tone === "accent" && "bg-accent text-accent-foreground",
        className,
      )}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
