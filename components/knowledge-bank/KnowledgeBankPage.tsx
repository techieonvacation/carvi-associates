"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { Container } from "@/components/site/Container";
import { Masthead } from "./Masthead";
import { CategoryNav } from "./CategoryNav";
import { CategoryRail } from "./CategoryRail";
import { SearchResults } from "./SearchResults";
import { FeaturedKnowledge } from "./FeaturedKnowledge";
import { InsightsSection } from "./InsightsSection";
import { ShortsSection } from "./ShortsSection";
import { CalculatorsSection } from "./CalculatorsSection";
import { UpdatesSection } from "./UpdatesSection";
import { UtilitiesSection } from "./UtilitiesSection";
import { LinksSection } from "./LinksSection";
import { ActsSection } from "./ActsSection";
import { FormsSection } from "./FormsSection";
import { CTASection } from "./CTASection";
import { KnowledgeFooter } from "./KnowledgeFooter";
import {
  SEARCH_INDEX,
  type KnowledgeCategory,
  type SearchableItem,
} from "./data";

function filterResults(
  query: string,
  category: KnowledgeCategory,
): SearchableItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return SEARCH_INDEX.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });
}

export function InsightPage({
  initialFilter = "all",
}: {
  initialFilter?: KnowledgeCategory;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const deferredQuery = useDeferredValue(debouncedQuery);
  const filter = initialFilter;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      startTransition(() => setDebouncedQuery(query));
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  const onHotkey = useEffectEvent((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInputRef.current?.focus();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", onHotkey);
    return () => window.removeEventListener("keydown", onHotkey);
  }, []);

  const results = filterResults(deferredQuery, filter);
  const isSearching = deferredQuery.trim().length > 0;

  /* On a single-category view only that section renders, and it numbers as 01. */
  const showAll = filter === "all";
  const sections = [
    { key: "featured", show: showAll, render: (n: number) => <FeaturedKnowledge index={n} /> },
    { key: "insights", show: showAll || filter === "insights", render: (n: number) => <InsightsSection index={n} /> },
    { key: "shorts", show: showAll || filter === "shorts", render: (n: number) => <ShortsSection index={n} /> },
    { key: "calculators", show: showAll || filter === "calculators", render: (n: number) => <CalculatorsSection index={n} /> },
    { key: "updates", show: showAll || filter === "updates", render: (n: number) => <UpdatesSection index={n} /> },
    { key: "utilities", show: showAll || filter === "utilities", render: (n: number) => <UtilitiesSection index={n} /> },
    { key: "links", show: showAll || filter === "links", render: (n: number) => <LinksSection index={n} /> },
    { key: "acts", show: showAll || filter === "acts", render: (n: number) => <ActsSection index={n} /> },
    { key: "forms", show: showAll || filter === "forms", render: (n: number) => <FormsSection index={n} /> },
  ].filter((section) => section.show);

  return (
    <div className="bg-background">
      <Masthead
        filter={filter}
        searchValue={query}
        onSearchChange={setQuery}
        searchInputRef={searchInputRef}
      />

      <CategoryNav active={filter} />

      {isSearching ? (
        <>
          <SearchResults
            query={deferredQuery}
            results={results}
            onClear={() => {
              setQuery("");
              setDebouncedQuery("");
              searchInputRef.current?.focus();
            }}
          />
          <Container className="pb-14">
            <CTASection />
            <KnowledgeFooter />
          </Container>
        </>
      ) : (
        <Container>
          <div className="flex gap-12 xl:gap-16">
            <CategoryRail filter={filter} />

            <div className="min-w-0 flex-1 pb-14">
              {sections.map((section, position) => (
                <div key={section.key}>{section.render(position + 1)}</div>
              ))}

              <div className="pt-4">
                <CTASection />
              </div>
              <KnowledgeFooter />
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}

/** @deprecated Use InsightPage */
export const KnowledgeBankPage = InsightPage;
