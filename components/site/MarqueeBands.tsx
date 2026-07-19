import { cn } from "@/lib/utils";
import { MARQUEE_WORDS } from "./home-data";

function MarqueeRow({
  direction,
  textClassName,
  strokeColor,
  shape,
}: {
  direction: "left" | "right";
  textClassName: string;
  strokeColor: string;
  shape: string;
}) {
  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          "flex w-max shrink-0 items-center gap-10",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
          "hover:[animation-play-state:paused]",
        )}
      >
        {[0, 1].map((dupe) => (
          <div key={dupe} className="flex shrink-0 items-center gap-10">
            {MARQUEE_WORDS.map((word, i) => (
              <span key={`${dupe}-${word}`} className="flex shrink-0 items-center gap-10">
                <span
                  className={cn(
                    "font-heading text-2xl font-bold whitespace-nowrap uppercase sm:text-3xl",
                    i % 2 === 1 ? "text-stroke" : textClassName,
                  )}
                  style={i % 2 === 1 ? ({ "--stroke-color": strokeColor } as React.CSSProperties) : undefined}
                >
                  {word}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shape} alt="" aria-hidden="true" className="h-4 w-4 shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarqueeBands() {
  return (
    <section className="overflow-hidden py-10">
      <div className="-rotate-2 bg-accent py-5 shadow-lg">
        <MarqueeRow
          direction="left"
          textClassName="text-white"
          strokeColor="#ffffff"
          shape="/images/shapes/slidet-text-shape-1.png"
        />
      </div>
      <div className="mt-4 rotate-2 bg-primary py-5 shadow-lg">
        <MarqueeRow
          direction="right"
          textClassName="text-accent"
          strokeColor="var(--accent)"
          shape="/images/shapes/slidet-text-shape-2.png"
        />
      </div>
    </section>
  );
}
