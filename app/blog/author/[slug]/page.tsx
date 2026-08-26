import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/Container";
import { Newsletter } from "@/components/site/Newsletter";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { BlogArchive } from "@/components/blog/BlogArchive";
import { PageBanner } from "@/components/blog/PageBanner";
import {
  getBlogArchive,
  getBlogAuthorBySlug,
  getBlogCategories,
  getBlogSection,
  getBlogTags,
  getRecentBlogPosts,
} from "@/lib/cms/blog-queries";
import { SITE_NAME, absoluteUrl } from "@/lib/site-config";

type AuthorRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ params }: AuthorRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getBlogAuthorBySlug(slug);

  if (!author) {
    return { title: `Author not found | ${SITE_NAME}`, robots: { index: false, follow: false } };
  }

  const description =
    author.bio ||
    `Articles written by ${author.name}${author.role ? `, ${author.role}` : ""} at ${SITE_NAME}.`;

  return {
    title: `${author.name} | ${SITE_NAME}`,
    description,
    alternates: { canonical: absoluteUrl(`/blog/author/${author.slug}`) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "profile",
      title: `${author.name} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/blog/author/${author.slug}`),
      siteName: SITE_NAME,
      ...(author.avatarUrl ? { images: [{ url: absoluteUrl(author.avatarUrl) }] } : {}),
    },
  };
}

export default async function AuthorArchivePage({ params, searchParams }: AuthorRouteProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const author = await getBlogAuthorBySlug(slug);

  if (!author) notFound();

  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const [section, result, categories, tags, recentPosts] = await Promise.all([
    getBlogSection(),
    getBlogArchive({
      author: author.slug,
      search: query.q,
      page,
    }),
    getBlogCategories(),
    getBlogTags(),
    getRecentBlogPosts(4),
  ]);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: absoluteUrl(`/blog/author/${author.slug}`),
    ...(author.role ? { jobTitle: author.role } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.avatarUrl ? { image: absoluteUrl(author.avatarUrl) } : {}),
    worksFor: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    sameAs: [author.linkedinUrl, author.twitterUrl, author.websiteUrl].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <PageBanner
        tagline={author.role || "Author"}
        titleLines={[author.name]}
        backgroundImageUrl={section.archiveHeroImage}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: author.name },
        ]}
        overlay={section.archiveHeroOverlay}
        height={section.archiveHeroHeight}
        align={section.archiveHeroAlign}
        showCrumbs={section.archiveShowCrumbs}
      />

      <div className="bg-white pt-14 max-md:pt-10">
        <Container>
          <AuthorCard author={author} linkToArchive={false} postCount={author.postCount} />
        </Container>
      </div>

      <BlogArchive
        section={section}
        result={result}
        categories={categories}
        tags={tags}
        recentPosts={recentPosts}
        basePath={`/blog/author/${author.slug}`}
        params={{ q: query.q }}
        emptyMessage={`${author.name} has not published anything yet.`}
      />

      {section.showNewsletter ? (
        <div className="findox-scope">
          <Newsletter />
        </div>
      ) : null}
    </>
  );
}
