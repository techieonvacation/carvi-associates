import Link from "next/link";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/site/Reveal";
import type {
  BlogArchiveResult,
  BlogCategoryItem,
  BlogPostItem,
  BlogSectionContent,
  BlogTagItem,
} from "@/lib/cms/types";
import { BlogFilters } from "./BlogFilters";
import { BlogPagination } from "./BlogPagination";
import { BlogSidebar } from "./BlogSidebar";
import { PostCard } from "./PostCard";
import { cn } from "@/lib/utils";

type BlogArchiveProps = {
  section: BlogSectionContent;
  result: BlogArchiveResult;
  categories: BlogCategoryItem[];
  tags: BlogTagItem[];
  recentPosts: BlogPostItem[];
  basePath: string;
  params: Record<string, string | undefined>;
  lockedCategory?: string;
  activeTagSlug?: string;
  emptyMessage?: string;
};

export function BlogArchive({
  section,
  result,
  categories,
  tags,
  recentPosts,
  basePath,
  params,
  lockedCategory,
  activeTagSlug,
  emptyMessage = "No articles match this filter yet.",
}: BlogArchiveProps) {
  const { posts, page, totalPages } = result;
  const showSidebar = section.showSidebar;

  return (
    <section className="blog-archive bg-background py-30 max-md:py-25 max-sm:py-20">
      <Container>
        <div
          className={cn(
            "grid gap-y-15",
            showSidebar ? "xl:grid-cols-[minmax(0,1fr)_370px] xl:gap-x-12.5" : "grid-cols-1",
          )}
        >
          <div className="min-w-0">
            <BlogFilters
              categories={categories}
              showSearch={section.showSearch}
              showCategories={section.showCategories}
              lockedCategory={lockedCategory}
            />

            {posts.length ? (
              <div
                className={cn(
                  "grid grid-cols-1 gap-7.5 md:grid-cols-2",
                  showSidebar ? "" : "lg:grid-cols-3",
                )}
              >
                {posts.map((post, index) => (
                  <Reveal
                    key={post.id}
                    direction="up"
                    delay={(index % 3) * 100}
                    duration={1300}
                    className="h-full"
                  >
                    <PostCard post={post} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-border bg-secondary/30 px-7.5 py-20 text-center">
                <h3 className="mb-3 text-[24px] leading-tight font-bold text-foreground">
                  No articles found
                </h3>
                <p className="mx-auto mb-7 max-w-110 text-base text-muted-foreground">
                  {emptyMessage}
                </p>
                <Link href="/blog" className="findox-btn findox-btn--base">
                  <span className="findox-btn__text">view all articles</span>
                  <span className="findox-btn__icon-box">
                    <span className="findox-btn__icon">
                      <i className="icon-arrow-right-up" aria-hidden="true" />
                      <i className="icon-arrow-right-up" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </div>
            )}

            <BlogPagination
              page={page}
              totalPages={totalPages}
              basePath={basePath}
              params={params}
            />
          </div>

          {showSidebar ? (
            <div className="min-w-0">
              <div className="blog-sidebar--sticky">
                <BlogSidebar
                  categories={categories}
                  tags={tags}
                  recentPosts={recentPosts}
                  showCategories={section.showCategories}
                  showTags={section.showTags}
                  activeCategorySlug={lockedCategory}
                  activeTagSlug={activeTagSlug}
                />
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
