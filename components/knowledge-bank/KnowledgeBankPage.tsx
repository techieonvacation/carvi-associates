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
import { Hero } from "./Hero";
import { FilterBar } from "./FilterBar";
import { SearchResults } from "./SearchResults";
import { SidebarNavigation } from "./SidebarNavigation";
import { QuickAccessGrid } from "./QuickAccessGrid";
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
    const matchesCategory = category === "all" || item.category === category;
    if (!matchesCategory) return false;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });
}

function sectionVisible(
  section: KnowledgeCategory | "featured" | "overview",
  filter: KnowledgeCategory,
) {
  if (filter === "all") return true;
  if (section === "featured" || section === "overview") return false;
  return section === filter;
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

  return (
    <div className="bg-background">
      <Hero
        filter={filter}
        searchValue={query}
        onSearchChange={setQuery}
        searchInputRef={searchInputRef}
      />

      <FilterBar active={filter} />

      <SearchResults
        query={deferredQuery}
        results={results}
        onClear={() => {
          setQuery("");
          setDebouncedQuery("");
          searchInputRef.current?.focus();
        }}
      />

      {!isSearching ? (
        <Container className="relative">
          <div className="flex gap-10 xl:gap-12">
            <SidebarNavigation activeFilter={filter} />

            <div className="min-w-0 flex-1 pb-16">
              {sectionVisible("overview", filter) ? <QuickAccessGrid /> : null}
              {sectionVisible("featured", filter) ? <FeaturedKnowledge /> : null}
              {sectionVisible("insights", filter) ? <InsightsSection /> : null}
              {sectionVisible("shorts", filter) ? <ShortsSection /> : null}
              {sectionVisible("calculators", filter) ? (
                <CalculatorsSection />
              ) : null}
              {sectionVisible("updates", filter) ? <UpdatesSection /> : null}
              {sectionVisible("utilities", filter) ? (
                <UtilitiesSection />
              ) : null}
              {sectionVisible("links", filter) ? <LinksSection /> : null}
              {sectionVisible("acts", filter) ? <ActsSection /> : null}
              {sectionVisible("forms", filter) ? <FormsSection /> : null}

              <div className="pt-6 pb-4">
                <CTASection />
              </div>
              <KnowledgeFooter />
            </div>
          </div>
        </Container>
      ) : (
        <Container className="pb-16">
          <div className="pt-10">
            <CTASection />
          </div>
          <KnowledgeFooter />
        </Container>
      )}
    </div>
  );
}

/** @deprecated Use InsightPage */
export const KnowledgeBankPage = InsightPage;
