import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { KnowledgeIcon } from "./icons";
import type { SearchableItem } from "./data";

export function SearchResults({
  query,
  results,
  onClear,
}: {
  query: string;
  results: SearchableItem[];
  onClear: () => void;
}) {
  if (!query.trim()) return null;

  return (
    <section
      className="border-b border-border/70 bg-secondary/35 py-10"
      aria-live="polite"
      aria-label="Search results"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing results for
            </p>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              “{query.trim()}”
            </h2>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Clear search
          </button>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center rounded-[24px] border border-dashed border-border bg-card/70 px-6 py-16 text-center">
            <div
              className="mb-5 flex size-20 items-center justify-center rounded-[28%] bg-gradient-to-br from-secondary via-primary/40 to-accent/30"
              aria-hidden="true"
            >
              <KnowledgeIcon name="search" className="size-8 text-accent" />
            </div>
            <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
              No results found
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Try a broader keyword, or browse categories below — calculators,
              forms, acts, and utilities are always a click away.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {results.map((item) => (
              <li key={`${item.category}-${item.id}`}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-accent/40 hover:shadow-[0_18px_40px_-32px_rgba(58,48,32,0.5)]"
                >
                  <Badge variant="secondary" className="mb-3 capitalize">
                    {item.category}
                  </Badge>
                  <h3 className="mb-1.5 font-heading text-lg font-bold text-foreground group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
