import type { Metadata } from "next";
import { BlogArchive } from "@/components/blog/BlogArchive";
import { PageBanner } from "@/components/blog/PageBanner";
import { PageJsonLd } from "@/components/seo/site-json-ld";
import {
  getBlogArchive,
  getBlogCategories,
  getBlogSection,
  getBlogTags,
  getRecentBlogPosts,
} from "@/lib/cms/blog-queries";
import { buildCollectionPageNode } from "@/lib/seo/json-ld";
import { buildMetadata, toAbsoluteUrl } from "@/lib/seo/metadata";
import { getSeoSettings } from "@/lib/seo/queries";

type BlogRouteProps = {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: BlogRouteProps): Promise<Metadata> {
  const [section, params] = await Promise.all([getBlogSection(), searchParams]);
  const page = Number(params.page ?? 1);
  const isCanonicalView = page <= 1 && !params.q && !params.category;
  const title = section.seoTitle || "Insights On Tax, GST & Business Compliance";

  return buildMetadata({
    path: "/blog",
    fallbackTitle: title,
    fallbackDescription: section.archiveIntro,
    entity: {
      title: page > 1 ? `${title} — Page ${page}` : undefined,
      description: section.seoDescription,
      keywords: section.seoKeywords,
      canonicalUrl: section.canonicalUrl,
      imageUrl: section.ogImageUrl || section.archiveHeroImage,
      twitterImageUrl: section.twitterImageUrl,
      noIndex: section.noIndex || !isCanonicalView,
    },
  });
}

export default async function BlogPage({ searchParams }: BlogRouteProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const [section, result, categories, tags, recentPosts, settings] = await Promise.all([
    getBlogSection(),
    getBlogArchive({ search: params.q, category: params.category, page }),
    getBlogCategories(),
    getBlogTags(),
    getRecentBlogPosts(4),
    getSeoSettings(),
  ]);

  const blogUrl = toAbsoluteUrl(settings, "/blog");
  const collectionNode = buildCollectionPageNode(settings, {
    url: blogUrl,
    name: section.seoTitle || section.archiveTitle.join(" "),
    description: section.seoDescription || section.archiveIntro,
    items: result.posts.map((post) => ({ name: post.title, url: `/blog/${post.slug}` })),
  });

  return (
    <>
      <PageJsonLd
        path="/blog"
        title={section.seoTitle || section.archiveTitle.join(" ")}
        description={section.seoDescription || section.archiveIntro}
        imageUrl={section.ogImageUrl || section.archiveHeroImage}
        pageType="CollectionPage"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
        extraNodes={[collectionNode]}
      />

      <PageBanner
        tagline={section.archiveTagline}
        titleLines={[...section.archiveTitle]}
        intro={section.archiveIntro}
        backgroundImageUrl={section.archiveHeroImage}
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
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
        basePath="/blog"
        params={{ q: params.q, category: params.category }}
        emptyMessage="Try a different category or clear your search."
      />

    </>
  );
}
