import Link from "next/link";
import { cn } from "@/lib/utils";

function pageWindow(current: number, total: number): Array<number | "gap"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set<number>([1, total, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < total) pages.add(current + 1);
  if (current <= 3) pages.add(2).add(3).add(4);
  if (current >= total - 2) pages.add(total - 1).add(total - 2).add(total - 3);

  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);

  return sorted.flatMap((page, index) =>
    index > 0 && page - sorted[index - 1] > 1 ? ["gap" as const, page] : [page],
  );
}

export function BlogPagination({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(target: number) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    if (target > 1) search.set("page", String(target));
    const queryString = search.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  }

  const items = pageWindow(page, totalPages);

  return (
    <nav aria-label="Pagination" className="blog-pagination mt-14 flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-2.5">
        <li>
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} className="blog-pagination__link" aria-label="Previous page">
              <i className="icon-arrow-left text-xs" aria-hidden="true" />
            </Link>
          ) : (
            <span className="blog-pagination__link blog-pagination__link--disabled" aria-disabled="true">
              <i className="icon-arrow-left text-xs" aria-hidden="true" />
            </span>
          )}
        </li>

        {items.map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} className="px-1 text-muted-foreground" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  "blog-pagination__link",
                  item === page && "blog-pagination__link--active",
                )}
              >
                {item}
              </Link>
            </li>
          ),
        )}

        <li>
          {page < totalPages ? (
            <Link href={hrefFor(page + 1)} className="blog-pagination__link" aria-label="Next page">
              <i className="icon-arrow-right text-xs" aria-hidden="true" />
            </Link>
          ) : (
            <span className="blog-pagination__link blog-pagination__link--disabled" aria-disabled="true">
              <i className="icon-arrow-right text-xs" aria-hidden="true" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
