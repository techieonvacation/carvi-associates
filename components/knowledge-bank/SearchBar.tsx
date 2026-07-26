"use client";

import { KnowledgeIcon } from "./icons";
import { cn } from "@/lib/utils";

export function SearchBar({
  value,
  onChange,
  inputRef,
  className,
  id = "knowledge-search",
}: {
  value: string;
  onChange: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <label htmlFor={id} className="sr-only">
        Search the knowledge bank
      </label>
      <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
        <KnowledgeIcon name="search" className="size-5" />
      </span>
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search insights, calculators, forms, acts…"
        autoComplete="off"
        className="h-14 w-full rounded-2xl border border-border bg-card/90 pr-24 pl-12 text-base text-foreground shadow-[0_18px_50px_-28px_rgba(58,48,32,0.45)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-border bg-secondary px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-muted-foreground sm:inline-flex">
        Ctrl K
      </kbd>
    </div>
  );
}
