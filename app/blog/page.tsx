import type { Metadata } from "next";
import { BlogArchive } from "@/components/blog/BlogArchive";
import { PageBanner } from "@/components/blog/PageBanner";
import { Newsletter } from "@/components/site/Newsletter";
import {
  getBlogArchive,
  getBlogCategories,
  getBlogSection,
  getBlogTags,
  getRecentBlogPosts,
} from "@/lib/cms/blog-queries";
import { SITE_NAME, absoluteUrl } from "@/lib/site-config";

type BlogRouteProps = {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: BlogRouteProps): Promise<Metadata> {
  const [section, params] = await Promise.all([getBlogSection(), searchParams]);
  const page = Number(params.page ?? 1);

  const title = section.seoTitle || `Blog & Insights | ${SITE_NAME}`;
  const description = section.seoDescription || section.archiveIntro;
  const isCanonicalView = page <= 1 && !params.q && !params.category;

  return {
    title: page > 1 ? `${title} — Page ${page}` : title,
    description,
    keywords: section.seoKeywords ?? undefined,
    alternates: { canonical: section.canonicalUrl || absoluteUrl("/blog") },
    robots: section.noIndex
      ? { index: false, follow: false }
      : { index: isCanonicalView, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl("/blog"),
      siteName: SITE_NAME,
      images: [{ url: absoluteUrl(section.ogImageUrl || section.archiveHeroImage) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        absoluteUrl(section.twitterImageUrl || section.ogImageUrl || section.archiveHeroImage),
      ],
    },
  };
}

export default async function BlogPage({ searchParams }: BlogRouteProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const [section, result, categories, tags, recentPosts] = await Promise.all([
    getBlogSection(),
    getBlogArchive({ search: params.q, category: params.category, page }),
    getBlogCategories(),
    getBlogTags(),
    getRecentBlogPosts(4),
  ]);

  return (
    <>
      <PageBanner
        tagline={section.archiveTagline}
        titleLines={[...section.archiveTitle]}
        intro={section.archiveIntro}
        backgroundImageUrl={section.archiveHeroImage}
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
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

      {section.showNewsletter ? (
        <div className="findox-scope">
          <Newsletter />
        </div>
      ) : null}
    </>
  );
}
