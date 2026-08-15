import Link from "next/link";
import { cn } from "@/lib/utils";

export function Tagline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "insight-tagline inline-flex items-start gap-2 bg-secondary py-2.5 pr-8 pl-5 font-heading text-[15px] leading-tight font-semibold text-accent uppercase",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/shapes/sec-title-shape-1-1.png"
        alt=""
        width={16}
        height={16}
        className="relative top-px h-4 w-4"
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

export function SectionShell({
  id,
  tagline,
  title,
  lede,
  count,
  action,
  children,
}: {
  id: string;
  tagline: string;
  title: string;
  lede: string;
  count?: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-30"
    >
      <header className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 max-sm:mb-8">
        <div className="min-w-0 max-w-2xl">
          <Tagline>{tagline}</Tagline>
          <h2
            id={headingId}
            className="mt-4.5 font-heading text-[30px] leading-[1.25] font-bold text-foreground max-sm:text-[25px]"
          >
            {title}
          </h2>
          <p className="mt-3.5 text-base leading-[1.75] text-muted-foreground">{lede}</p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-4">
          {count ? (
            <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
              {count}
            </span>
          ) : null}
          {action ? (
            <Link
              href={action.href}
              className="group inline-flex items-center gap-2 font-heading text-[15px] font-semibold text-accent transition-colors duration-500 hover:text-foreground"
            >
              {action.label}
              <i
                className="icon-arrow-right-up text-[11px] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          ) : null}
        </div>
      </header>
      {children}
    </section>
  );
}

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
        "inline-flex items-center rounded-full border px-3.5 py-1 text-[13px] leading-tight font-medium whitespace-nowrap",
        tone === "muted" && "border-border bg-secondary/50 text-muted-foreground",
        tone === "accent" && "border-accent bg-accent text-white",
        tone === "primary" && "border-primary bg-primary text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function IconBadge({
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
        "inline-flex size-12.5 shrink-0 items-center justify-center rounded-full transition-colors duration-500",
        tone === "muted"
          ? "bg-secondary text-accent group-hover:bg-accent group-hover:text-white"
          : "bg-accent text-white",
        className,
      )}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

export function ArrowButton({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-accent transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-white",
        className,
      )}
      aria-hidden="true"
    >
      <i className="icon-arrow-right-up text-[11px]" />
    </span>
  );
}

export function Dot() {
  return (
    <span className="text-border" aria-hidden="true">
      ·
    </span>
  );
}

export const insightCard =
  "insight-card rounded-[20px] border border-border bg-white";
