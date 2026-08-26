import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArchive } from "@/components/blog/BlogArchive";
import { PageBanner } from "@/components/blog/PageBanner";
import { Newsletter } from "@/components/site/Newsletter";
import {
  getBlogArchive,
  getBlogCategories,
  getBlogCategoryBySlug,
  getBlogSection,
  getBlogTags,
  getRecentBlogPosts,
} from "@/lib/cms/blog-queries";
import { SITE_NAME, absoluteUrl } from "@/lib/site-config";

type CategoryRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ params }: CategoryRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getBlogCategoryBySlug(slug);

  if (!category) {
    return { title: `Topic not found | ${SITE_NAME}`, robots: { index: false, follow: false } };
  }

  const title = category.seoTitle || `${category.name} Articles & Updates | ${SITE_NAME}`;
  const description =
    category.seoDescription ||
    category.description ||
    `${category.name} insights, guidance and compliance updates from ${SITE_NAME}.`;

  return {
    title,
    description,
    keywords: category.seoKeywords ?? undefined,
    alternates: { canonical: absoluteUrl(`/blog/category/${category.slug}`) },
    robots: category.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(`/blog/category/${category.slug}`),
      siteName: SITE_NAME,
      ...(category.imageUrl ? { images: [{ url: absoluteUrl(category.imageUrl) }] } : {}),
    },
  };
}

export default async function CategoryArchivePage({ params, searchParams }: CategoryRouteProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = await getBlogCategoryBySlug(slug);

  if (!category) notFound();

  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const [section, result, categories, tags, recentPosts] = await Promise.all([
    getBlogSection(),
    getBlogArchive({
      category: category.slug,
      search: query.q,
      page,
    }),
    getBlogCategories(),
    getBlogTags(),
    getRecentBlogPosts(4),
  ]);

  return (
    <>
      <PageBanner
        tagline="Category"
        titleLines={[category.name]}
        intro={category.description || undefined}
        backgroundImageUrl={category.imageUrl || section.archiveHeroImage}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: category.name },
        ]}
        overlay={section.archiveHeroOverlay}
        height={section.archiveHeroHeight}
        align={section.archiveHeroAlign}
        showCrumbs={section.archiveShowCrumbs}
      />

      <BlogArchive
        section={section}
        result={result}
        categories={categories}
        tags={tags}
        recentPosts={recentPosts}
        basePath={`/blog/category/${category.slug}`}
        params={{ q: query.q }}
        lockedCategory={category.slug}
        emptyMessage={`No ${category.name} articles have been published yet. Check back soon or browse another topic.`}
      />

      {section.showNewsletter ? (
        <div className="findox-scope">
          <Newsletter />
        </div>
      ) : null}
    </>
  );
}
