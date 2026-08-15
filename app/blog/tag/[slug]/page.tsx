import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArchive } from "@/components/blog/BlogArchive";
import { PageBanner } from "@/components/blog/PageBanner";
import { Newsletter } from "@/components/site/Newsletter";
import {
  getBlogArchive,
  getBlogCategories,
  getBlogSection,
  getBlogTagBySlug,
  getBlogTags,
  getRecentBlogPosts,
} from "@/lib/cms/blog-queries";
import { SITE_NAME, absoluteUrl } from "@/lib/site-config";

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

  const description =
    tag.description || `Articles tagged "${tag.name}" from the ${SITE_NAME} knowledge desk.`;

  return {
    title: `${tag.name} | Blog | ${SITE_NAME}`,
    description,
    alternates: { canonical: absoluteUrl(`/blog/tag/${tag.slug}`) },
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      title: `${tag.name} | Blog | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/blog/tag/${tag.slug}`),
      siteName: SITE_NAME,
    },
  };
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

      {section.showNewsletter ? (
        <div className="findox-scope">
          <Newsletter />
        </div>
      ) : null}
    </>
  );
}
