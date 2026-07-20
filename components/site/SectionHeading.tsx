import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SplitHeading } from "./SplitHeading";

/**
 * The "sec-title" block reused at the top of every content section: the
 * ribbon tagline pill (clip-path shape in findox.css) followed by a
 * character-stagger heading (the reference's `bw-split-in-up`).
 */
export function SectionHeading({
  tagline,
  lines,
  align = "left",
  taglineBg = "#f4ebd8",
  titleColor,
  light = false,
  className,
}: {
  tagline: string;
  lines: string[];
  align?: "left" | "center";
  taglineBg?: string;
  titleColor?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("sec-title", align === "center" && "sec-title--center", className)}
      style={
        {
          "--tagline-bg": taglineBg,
          ...(titleColor ? { "--title-color": titleColor } : light ? { "--title-color": "#faf5e9" } : {}),
        } as React.CSSProperties
      }
    >
      <Reveal direction="up" className={cn(align === "center" && "flex justify-center")}>
        <div className="sec-title__top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/shapes/sec-title-shape-1-1.png"
            alt=""
            width={18}
            height={18}
            className="sec-title__shape"
            aria-hidden="true"
          />
          <p className="sec-title__tagline">{tagline}</p>
        </div>
      </Reveal>
      <SplitHeading lines={lines} className="sec-title__title bw-split-in-up" />
    </div>
  );
}
