import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArchive } from "@/components/blog/BlogArchive";
import { PageBanner } from "@/components/blog/PageBanner";
import {
  getBlogArchive,
  getBlogCategories,
  getBlogSection,
  getBlogTagBySlug,
  getBlogTags,
  getRecentBlogPosts,
} from "@/lib/cms/blog-queries";
import { PageJsonLd } from "@/components/seo/site-json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/site-config";

type TagRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ params }: TagRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getBlogTagBySlug(slug);

  if (!tag) {
    return { title: `Tag not found | ${SITE_NAME}`, robots: { index: false, follow: false } };
  }

  return buildMetadata({
    path: `/blog/tag/${tag.slug}`,
    fallbackTitle: `${tag.name} Articles`,
    fallbackDescription:
      tag.description || `Articles tagged "${tag.name}" from the ${SITE_NAME} knowledge desk.`,
    entity: { noIndex: true },
  });
}

export default async function TagArchivePage({ params, searchParams }: TagRouteProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const tag = await getBlogTagBySlug(slug);

  if (!tag) notFound();

  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const [section, result, categories, tags, recentPosts] = await Promise.all([
    getBlogSection(),
    getBlogArchive({
      tag: tag.slug,
      search: query.q,
      page,
    }),
    getBlogCategories(),
    getBlogTags(),
    getRecentBlogPosts(4),
  ]);

  return (
    <>
      <PageJsonLd
        path={`/blog/tag/${tag.slug}`}
        title={`${tag.name} Articles`}
        description={tag.description}
        pageType="CollectionPage"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: tag.name, path: `/blog/tag/${tag.slug}` },
        ]}
        includeGlobalNodes={false}
        includeFaqs={false}
      />

      <PageBanner
        tagline="Tag"
        titleLines={[tag.name]}
        intro={tag.description || undefined}
        backgroundImageUrl={section.archiveHeroImage}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: tag.name },
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
        basePath={`/blog/tag/${tag.slug}`}
        params={{ q: query.q }}
        activeTagSlug={tag.slug}
        emptyMessage={`Nothing is tagged "${tag.name}" yet. Browse all articles instead.`}
      />

    </>
  );
}
