import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SplitHeading } from "./SplitHeading";

/** The "sec-title" block reused at the top of every content section: a small tagline pill, then a stagger-in heading. */
export function SectionHeading({
  tagline,
  lines,
  align = "left",
  light = false,
  className,
}: {
  tagline: string;
  lines: string[];
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <Reveal direction="up">
        <div
          className={cn(
            "mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5",
            light ? "bg-white/10" : "bg-secondary",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/shapes/sec-title-shape-1-1.png"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
          />
          <p
            className={cn(
              "text-xs font-bold tracking-[0.2em] uppercase",
              light ? "text-white" : "text-accent",
            )}
          >
            {tagline}
          </p>
        </div>
      </Reveal>
      <SplitHeading
        lines={lines}
        className={cn(
          "font-heading text-3xl leading-[1.15] font-bold sm:text-4xl lg:text-[2.75rem]",
          light ? "text-white!" : "text-foreground!",
        )}
      />
    </div>
  );
}
