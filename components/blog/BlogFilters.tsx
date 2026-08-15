"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { BlogCategoryItem } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type BlogFiltersProps = {
  categories: BlogCategoryItem[];
  showSearch: boolean;
  showCategories: boolean;
  lockedCategory?: string;
};

export function BlogFilters({
  categories,
  showSearch,
  showCategories,
  lockedCategory,
}: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = lockedCategory ?? searchParams.get("category") ?? "";
  const activeSearch = searchParams.get("q") ?? "";

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const showTabs = showCategories && !lockedCategory && categories.length > 0;
  if (!showSearch && !showTabs) return null;

  return (
    <div className="blog-filters mb-12.5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      {showTabs ? (
        <ul className="blog-filters__list m-0 flex list-none flex-wrap items-center gap-0 p-0">
          <li>
            <button
              type="button"
              onClick={() => pushParams((params) => params.delete("category"))}
              aria-pressed={!activeCategory}
              className={cn(
                "cursor-pointer border px-6 py-[9.5px] text-center font-heading text-base font-semibold capitalize transition-all duration-500 hover:border-accent hover:bg-accent hover:text-white",
                !activeCategory
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-transparent text-muted-foreground",
              )}
            >
              All
            </button>
          </li>
          {categories.map((category) => {
            const active = activeCategory === category.slug;
            return (
              <li key={category.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    pushParams((params) =>
                      active
                        ? params.delete("category")
                        : params.set("category", category.slug),
                    )
                  }
                  className={cn(
                    "cursor-pointer border px-6 py-[9.5px] text-center font-heading text-base font-semibold capitalize transition-all duration-500 hover:border-accent hover:bg-accent hover:text-white",
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-transparent text-muted-foreground",
                  )}
                >
                  {category.name}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <span />
      )}

      {showSearch ? (
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const value = String(new FormData(event.currentTarget).get("q") ?? "").trim();
            pushParams((params) => {
              if (value) params.set("q", value);
              else params.delete("q");
            });
          }}
          className="relative w-full shrink-0 lg:w-87.5"
        >
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <input
            id="blog-search"
            key={activeSearch}
            name="q"
            type="search"
            defaultValue={activeSearch}
            placeholder="Search articles…"
            className="h-13.5 w-full border border-border bg-white pr-14 pl-6 text-[15px] text-foreground outline-none transition-colors duration-500 placeholder:text-muted-foreground/70 focus:border-accent"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute top-1/2 right-0 flex h-13.5 w-13.5 -translate-y-1/2 cursor-pointer items-center justify-center bg-accent text-white transition-colors duration-500 hover:bg-primary hover:text-foreground"
          >
            <Search className="size-4.5" aria-hidden="true" />
          </button>
        </form>
      ) : null}
    </div>
  );
}
