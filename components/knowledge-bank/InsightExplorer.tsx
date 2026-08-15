"use client";

import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import { InsightToolbar } from "./InsightToolbar";
import { SearchResults } from "./SearchResults";
import { SEARCH_INDEX, type KnowledgeCategory, type SearchableItem } from "./data";

/* Search spans the whole library, whatever category is being browsed — the
   field promises every entry, and each result carries its own category tag. */
function filterResults(query: string): SearchableItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return SEARCH_INDEX.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q),
  );
}

export function InsightExplorer({
  filter,
  sidebar,
  children,
}: {
  filter: KnowledgeCategory;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const deferredQuery = useDeferredValue(debouncedQuery);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      startTransition(() => setDebouncedQuery(query));
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isSearching = deferredQuery.trim().length > 0;
  const results = filterResults(deferredQuery);

  return (
    <>
      <InsightToolbar
        filter={filter}
        value={query}
        onChange={setQuery}
        inputRef={searchInputRef}
      />

      <div className="grid gap-y-15 xl:grid-cols-[minmax(0,1fr)_370px] xl:gap-x-12.5">
        <div className="insight-sections min-w-0">
          {isSearching ? (
            <SearchResults
              query={deferredQuery}
              results={results}
              onClear={() => {
                setQuery("");
                setDebouncedQuery("");
                searchInputRef.current?.focus();
              }}
            />
          ) : (
            children
          )}
        </div>

        <div className="min-w-0">
          <div className="insight-sidebar--sticky">{sidebar}</div>
        </div>
      </div>
    </>
  );
}
