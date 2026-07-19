"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight, dependency-free replacement for the source template's
 * Owl Carousel: a native scroll-snap track (so touch/trackpad swipe works
 * for free) plus arrow + dot controls that scroll items into view.
 */
export function Carousel({
  items,
  itemClassName = "basis-full",
  gapClassName = "gap-6",
  autoplay = false,
  showDots = true,
  showArrows = true,
  className,
}: {
  items: React.ReactNode[];
  itemClassName?: string;
  gapClassName?: string;
  autoplay?: number | false;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ratios = useRef<number[]>(items.map(() => 0));
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          ratios.current[idx] = entry.intersectionRatio;
        });
        let bestIdx = 0;
        let bestRatio = -1;
        ratios.current.forEach((ratio, idx) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIdx = idx;
          }
        });
        setActive(bestIdx);
      },
      { root: track, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      const nextIndex = atEnd ? 0 : Math.min(active + 1, items.length - 1);
      const target = itemRefs.current[nextIndex];
      if (target) track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    }, autoplay);
    return () => clearInterval(id);
  }, [autoplay, active, items.length]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    const target = itemRefs.current[clamped];
    if (track && target) track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        className={cn(
          "scrollbar-hide flex snap-x snap-mandatory overflow-x-auto scroll-smooth",
          gapClassName,
        )}
      >
        {items.map((item, i) => (
          <div
            key={i}
            data-index={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={cn("snap-start shrink-0", itemClassName)}
          >
            {item}
          </div>
        ))}
      </div>

      {(showArrows || showDots) && (
        <div className="mt-8 flex items-center justify-center gap-4">
          {showArrows && (
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => goTo(active - 1)}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
          {showDots && (
            <div className="flex items-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === active ? "w-6 bg-accent" : "w-2 bg-border",
                  )}
                />
              ))}
            </div>
          )}
          {showArrows && (
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => goTo(active + 1)}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
