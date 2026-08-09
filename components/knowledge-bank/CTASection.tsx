import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

/**
 * A quiet closing panel. The page above it is dense reference material, so the
 * ask is a single line and two plain links — a coloured full-width banner here
 * would read as an ad interrupting a library.
 */
export function CTASection() {
  return (
    <aside
      aria-labelledby="insight-help-title"
      className="rounded-xl border border-border/70 bg-secondary/35 px-5 py-6 sm:px-7 sm:py-7"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <h2
            id="insight-help-title"
            className="font-heading text-[1.0625rem] font-bold text-foreground md:text-lg"
          >
            Looking for something that isn&apos;t here?
          </h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Tell us what you need and we&apos;ll point you to the right resource — or
            prepare it for you.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[13px] font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none"
          >
            <Mail className="size-3.5" aria-hidden="true" />
            Ask our team
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-4 py-2.5 text-[13px] font-semibold text-foreground transition-colors hover:border-accent/50 hover:bg-secondary/50 focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none"
          >
            Our services
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
