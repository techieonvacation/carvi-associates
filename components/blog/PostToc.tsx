"use client";

import { useEffect, useState } from "react";
import type { HeadingEntry } from "@/lib/cms/blog-sanitize";
import { cn } from "@/lib/utils";

export function PostToc({ entries }: { entries: HeadingEntry[] }) {
  const [activeId, setActiveId] = useState<string>(entries[0]?.id ?? "");

  useEffect(() => {
    if (!entries.length) return;

    const nodes = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((node): node is HTMLElement => node !== null);

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 2) return null;

  return (
    <nav className="post-toc" aria-label="On this page">
      <p className="post-toc__title">On this page</p>
      <ol className="post-toc__list">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={cn(
              "post-toc__item",
              entry.level === 3 && "pl-4",
            )}
          >
            <a
              href={`#${entry.id}`}
              aria-current={activeId === entry.id ? "location" : undefined}
              className={cn("post-toc__link", activeId === entry.id && "post-toc__link--active")}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
