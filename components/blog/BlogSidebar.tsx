import Link from "next/link";
import { FindoxButton } from "@/components/site/FindoxButton";
import type { BlogCategoryItem, BlogPostItem, BlogTagItem } from "@/lib/cms/types";
import { PostRailCard } from "./PostCard";
import { cn } from "@/lib/utils";

function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="blog-widget rounded-[20px] border border-border bg-white p-7.5 max-sm:p-5">
      <h3 className="blog-widget__title relative mb-6.5 pb-4 text-[22px] leading-tight font-bold text-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function BlogSidebar({
  categories,
  tags,
  recentPosts,
  showCategories,
  showTags,
  activeCategorySlug,
  activeTagSlug,
}: {
  categories: BlogCategoryItem[];
  tags: BlogTagItem[];
  recentPosts: BlogPostItem[];
  showCategories: boolean;
  showTags: boolean;
  activeCategorySlug?: string;
  activeTagSlug?: string;
}) {
  return (
    <aside className="blog-sidebar flex flex-col gap-7.5" aria-label="Blog sidebar">
      {showCategories && categories.length ? (
        <Widget title="Categories">
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {categories.map((category) => {
              const active = category.slug === activeCategorySlug;
              return (
                <li key={category.id}>
                  <Link
                    href={`/blog/category/${category.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "blog-widget__link flex items-center justify-between gap-3 rounded-[10px] px-4.5 py-3 text-base font-medium transition-all duration-500",
                      active
                        ? "bg-accent text-white"
                        : "bg-secondary/40 text-muted-foreground hover:bg-accent hover:text-white",
                    )}
                  >
                    <span className="truncate">{category.name}</span>
                    <span className="shrink-0 text-sm opacity-70">{category.postCount ?? 0}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Widget>
      ) : null}

      {recentPosts.length ? (
        <Widget title="Recent Posts">
          <ul className="m-0 flex list-none flex-col gap-5.5 p-0">
            {recentPosts.map((post) => (
              <PostRailCard key={post.id} post={post} />
            ))}
          </ul>
        </Widget>
      ) : null}

      {showTags && tags.length ? (
        <Widget title="Tags">
          <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
            {tags.slice(0, 16).map((tag) => {
              const active = tag.slug === activeTagSlug;
              return (
                <li key={tag.id}>
                  <Link
                    href={`/blog/tag/${tag.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-block border px-4 py-2 text-sm font-medium transition-all duration-500",
                      active
                        ? "border-accent bg-accent text-white"
                        : "border-border text-muted-foreground hover:border-accent hover:bg-accent hover:text-white",
                    )}
                  >
                    {tag.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Widget>
      ) : null}

      <section className="blog-widget-cta relative overflow-hidden rounded-[20px] bg-accent px-7.5 py-10 text-center max-sm:px-5">
        <div className="relative z-1">
          <span className="mb-5 inline-flex size-15 items-center justify-center rounded-full bg-primary text-[26px] text-accent">
            <i className="icon-phone-call" aria-hidden="true" />
          </span>
          <h3 className="mb-3 text-[24px] leading-[1.3] font-bold text-white">
            Need Help With Tax Or Compliance?
          </h3>
          <p className="mb-6.5 text-base leading-relaxed text-white/80">
            Speak to a Carvi Associates partner about your specific situation.
          </p>
          <FindoxButton href="/#contact" text="Book a consultation" />
        </div>
      </section>
    </aside>
  );
}
