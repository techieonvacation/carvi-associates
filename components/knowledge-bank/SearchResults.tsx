import Link from "next/link";
import { Tag, insightCard } from "./insight-ui";
import { categoryLabel, type SearchableItem } from "./data";
import { cn } from "@/lib/utils";

export function SearchResults({
  query,
  results,
  onClear,
}: {
  query: string;
  results: SearchableItem[];
  onClear: () => void;
}) {
  const term = query.trim();

  return (
    <div aria-live="polite">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-border pb-6">
        <div className="min-w-0">
          <h2 className="font-heading text-[25px] leading-tight font-bold text-foreground max-sm:text-[22px]">
            {results.length} {results.length === 1 ? "result" : "results"}
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Matching &ldquo;<span className="font-medium text-foreground">{term}</span>&rdquo;
            across the full library
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer border border-border px-5 py-[9.5px] font-heading text-[15px] font-semibold text-muted-foreground transition-all duration-500 hover:border-accent hover:bg-accent hover:text-white"
        >
          Clear search
        </button>
      </div>

      {results.length ? (
        <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-2">
          {results.map((item) => (
            <li key={`${item.category}-${item.id}`}>
              <Link
                href={item.href}
                className={cn(insightCard, "group flex h-full flex-col p-6 max-sm:p-5")}
              >
                <Tag className="self-start">{categoryLabel(item.category)}</Tag>
                <h3 className="mt-4 font-heading text-[19px] leading-[1.35] font-bold text-foreground transition-colors duration-500 group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.7] text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[20px] border border-border bg-secondary/30 px-7.5 py-20 text-center max-sm:px-5 max-sm:py-12">
          <h3 className="mb-3 font-heading text-[24px] leading-tight font-bold text-foreground max-sm:text-[20px]">
            Nothing matched your search
          </h3>
          <p className="mx-auto mb-7 max-w-110 text-base text-muted-foreground">
            Try a shorter term, or browse a category — the library indexes titles and
            summaries, not full article text.
          </p>
          <Link
            href="/insight"
            scroll={false}
            className="inline-flex items-center border border-accent bg-accent px-6 py-[11px] font-heading text-[15px] font-semibold text-white transition-all duration-500 hover:border-border hover:bg-transparent hover:text-foreground"
          >
            Browse the full library
          </Link>
        </div>
      )}
    </div>
  );
}
