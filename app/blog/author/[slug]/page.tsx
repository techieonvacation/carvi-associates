import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/Container";
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
import { PageJsonLd } from "@/components/seo/site-json-ld";
import { buildPersonNode } from "@/lib/seo/json-ld";
import { buildMetadata, toAbsoluteUrl } from "@/lib/seo/metadata";
import { getSeoSettings } from "@/lib/seo/queries";
import { SITE_NAME } from "@/lib/site-config";

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

  return buildMetadata({
    path: `/blog/author/${author.slug}`,
    fallbackTitle: author.name,
    fallbackDescription:
      author.bio ||
      `Articles written by ${author.name}${author.role ? `, ${author.role}` : ""} at ${SITE_NAME}.`,
    entity: {
      imageUrl: author.avatarUrl || undefined,
      ogType: "profile",
      authors: [author.name],
    },
  });
}

export default async function AuthorArchivePage({ params, searchParams }: AuthorRouteProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const author = await getBlogAuthorBySlug(slug);

  if (!author) notFound();

  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const [section, result, categories, tags, recentPosts, settings] = await Promise.all([
    getBlogSection(),
    getBlogArchive({
      author: author.slug,
      search: query.q,
      page,
    }),
    getBlogCategories(),
    getBlogTags(),
    getRecentBlogPosts(4),
    getSeoSettings(),
  ]);

  const authorPath = `/blog/author/${author.slug}`;
  const personNode = buildPersonNode(settings, {
    url: toAbsoluteUrl(settings, authorPath),
    name: author.name,
    role: author.role,
    bio: author.bio,
    imageUrl: author.avatarUrl,
    sameAs: [author.linkedinUrl, author.twitterUrl, author.websiteUrl].filter(
      (value): value is string => Boolean(value),
    ),
  });

  return (
    <>
      <PageJsonLd
        path={authorPath}
        title={author.name}
        description={author.bio}
        imageUrl={author.avatarUrl || undefined}
        pageType="ProfilePage"
        primaryEntityId={`${toAbsoluteUrl(settings, authorPath)}#person`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: author.name, path: authorPath },
        ]}
        extraNodes={[personNode]}
        includeFaqs={false}
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

      <div className="bg-background pt-14 max-md:pt-10">
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

    </>
  );
}
