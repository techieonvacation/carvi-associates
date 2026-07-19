"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const BACK_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const STAGGER_MS = 14;

type CharToken = { char: string; delay: number };
type WordToken = CharToken[];
type LineToken = WordToken[];

/** Pure data prep (outside the component) — splits each line into words/chars and assigns each a sequential stagger delay. */
function buildLines(lines: string[]): LineToken[] {
  let index = 0;
  return lines.map((line) =>
    line.split(" ").map((word) =>
      word.split("").map((char) => {
        const token = { char, delay: index * STAGGER_MS };
        index += 1;
        return token;
      }),
    ),
  );
}

/**
 * Per-character stagger reveal for section headings — the "bw-split-in-up"
 * (GSAP SplitText + ScrollTrigger) equivalent from the source template.
 * `lines` renders each string on its own line (the source uses <br> to
 * break these headings).
 */
export function SplitHeading({
  lines,
  className,
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [shown, setShown] = useState(false);
  const structuredLines = buildLines(lines);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={cn("block", className)}>
      {structuredLines.map((words, lineIdx) => (
        <span key={lineIdx} className="block">
          {words.map((chars, wordIdx) => (
            <Fragment key={wordIdx}>
              <span className="inline-block whitespace-nowrap">
                {chars.map(({ char, delay }, charIdx) => (
                  <span
                    key={charIdx}
                    className={cn(
                      "inline-block transition-[opacity,transform]",
                      shown ? "translate-y-0 opacity-100" : "translate-y-[0.9em] opacity-0",
                    )}
                    style={{
                      transitionDuration: "700ms",
                      transitionDelay: `${delay}ms`,
                      transitionTimingFunction: BACK_EASE,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              {wordIdx < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}
