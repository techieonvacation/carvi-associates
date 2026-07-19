import { cn } from "@/lib/utils";
import { MARQUEE_WORDS } from "./home-data";
import "./css/slidetext.css";

/**
 * MarqueeBands — the reference `slide-text` section: two full-bleed ribbons
 * skewed in opposite directions so they cross in an X (green skewed
 * up-left, yellow skewed down-right), each carrying an infinitely-scrolling
 * row of the hashtag words — separated by the loop shape — scrolling in
 * opposite directions. Mirrors `.slide-text` / `.slide-text__one` /
 * `.slide-text__two` / `.slide-text__scroll`.
 */

const SHAPES: Record<"one" | "two", { src: string; width: number; height: number }> = {
  one: { src: "/images/shapes/slidet-text-shape-1.png", width: 60, height: 38 },
  two: { src: "/images/shapes/slidet-text-shape-2.png", width: 59, height: 38 },
};

function MarqueeTrack({
  direction,
  variant,
}: {
  direction: "left" | "right";
  variant: "one" | "two";
}) {
  const shape = SHAPES[variant];

  return (
    <div
      className={cn(
        "slide-text__scroll font-heading flex w-max items-center gap-7.5 whitespace-nowrap",
        variant === "two" && "slide-text__scroll--right",
        direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
        "hover:[animation-play-state:paused]",
      )}
    >
      {[0, 1].map((dupe) => (
        <div key={dupe} className="flex w-max shrink-0 items-center gap-7.5" aria-hidden={dupe === 1}>
          {MARQUEE_WORDS.map((word, i) => (
            <span
              key={`${dupe}-${word}`}
              className="slide-text__item flex shrink-0 items-center gap-7.5"
            >
              <span className={i % 2 === 1 ? "slide-text__scroll__outline" : undefined}>
                {word}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shape.src}
                alt=""
                aria-hidden="true"
                width={shape.width}
                height={shape.height}
                className="shrink-0"
              />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function MarqueeBands() {
  return (
    <section
      className="slide-text relative z-1 my-23.5 overflow-hidden max-[1599px]:my-16 max-[1199px]:my-9.25 max-[991px]:my-5"
      aria-hidden="true"
    >
      <div className="slide-text__container">
        <div className="slide-text__one overflow-hidden py-8">
          <MarqueeTrack direction="left" variant="one" />
        </div>
        <div className="slide-text__two overflow-hidden py-8">
          <MarqueeTrack direction="right" variant="two" />
        </div>
      </div>
    </section>
  );
}
