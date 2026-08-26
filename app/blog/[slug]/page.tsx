import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { CommentSection } from "@/components/blog/CommentSection";
import { PageBanner } from "@/components/blog/PageBanner";
import { PostCard } from "@/components/blog/PostCard";
import { PostContent } from "@/components/blog/PostContent";
import { PostShare } from "@/components/blog/PostShare";
import { PostToc } from "@/components/blog/PostToc";
import { contentTypeLabel, formatLongDate, toIsoDate } from "@/components/blog/blog-format";
import { extractHeadings } from "@/lib/cms/blog-sanitize";
import {
  getBlogCategories,
  getBlogPostBySlug,
  getBlogSection,
  getBlogTags,
  getPostComments,
  getRecentBlogPosts,
  getRelatedPosts,
} from "@/lib/cms/blog-queries";
import { SITE_NAME, absoluteUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type ArticleRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: `Article not found | ${SITE_NAME}`, robots: { index: false, follow: false } };
  }

  const url = absoluteUrl(`/blog/${post.slug}`);
  const title = post.seoTitle || `${post.title} | ${SITE_NAME}`;
  const description = post.seoDescription || post.excerpt;
  const image = absoluteUrl(post.ogImageUrl || post.coverImageUrl);

  return {
    title,
    description,
    keywords: post.seoKeywords ?? post.tags.map((tag) => tag.name).join(", ") ?? undefined,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    alternates: { canonical: post.canonicalUrl || url },
    robots: post.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME,
      publishedTime: toIsoDate(post.publishedAt),
      modifiedTime: toIsoDate(post.updatedAt ?? post.publishedAt),
      authors: post.author ? [post.author.name] : undefined,
      section: post.category?.name,
      tags: post.tags.map((tag) => tag.name),
      images: [{ url: image, width: 1200, height: 630, alt: post.coverImageAlt || post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(post.twitterImageUrl || post.ogImageUrl || post.coverImageUrl)],
    },
  };
}

export default async function ArticlePage({ params }: ArticleRouteProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const [section, related, comments, categories, tags, recentPosts] = await Promise.all([
    getBlogSection(),
    getRelatedPosts(post, 3),
    getPostComments(post.id),
    getBlogCategories(),
    getBlogTags(),
    getRecentBlogPosts(4),
  ]);

  const url = absoluteUrl(`/blog/${post.slug}`);
  const commentsOpen = section.allowComments && post.allowComments;
  const headings = extractHeadings(post.contentHtml);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title.slice(0, 110),
        description: post.seoDescription || post.excerpt,
        image: [absoluteUrl(post.ogImageUrl || post.coverImageUrl)],
        datePublished: toIsoDate(post.publishedAt),
        dateModified: toIsoDate(post.updatedAt ?? post.publishedAt),
        inLanguage: "en-IN",
        wordCount: post.readingMinutes * 200,
        articleSection: post.category?.name,
        keywords: post.tags.map((tag) => tag.name).join(", "),
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: post.author
          ? {
              "@type": "Person",
              name: post.author.name,
              jobTitle: post.author.role || undefined,
              url: absoluteUrl(`/blog/author/${post.author.slug}`),
            }
          : { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl("/"),
          logo: { "@type": "ImageObject", url: absoluteUrl("/images/logo-dark.png") },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
          ...(post.category
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.category.name,
                  item: absoluteUrl(`/blog/category/${post.category.slug}`),
                },
              ]
            : []),
          { "@type": "ListItem", position: post.category ? 4 : 3, name: post.title, item: url },
        ],
      },
      ...(post.faqs.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: post.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <PageBanner
        tagline={contentTypeLabel(post.contentType)}
        titleLines={[post.title]}
        backgroundImageUrl={post.coverImageUrl}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          ...(post.category
            ? [{ label: post.category.name, href: `/blog/category/${post.category.slug}` }]
            : []),
          { label: post.title },
        ]}
        overlay={section.archiveHeroOverlay}
        height={section.archiveHeroHeight}
        align={section.archiveHeroAlign}
        showCrumbs={section.archiveShowCrumbs}
      />

      <article className="blog-article bg-white py-30 max-md:py-25 max-sm:py-20">
        <Container>
          <div
            className={cn(
              "grid gap-y-15",
              section.showSidebar ? "xl:grid-cols-[minmax(0,1fr)_370px] xl:gap-x-12.5" : "",
            )}
          >
            <div className="min-w-0">
              <figure className="m-0 mb-10 overflow-hidden rounded-[20px]">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.coverImageAlt || post.title}
                    fill
                    priority
                    sizes="(min-width: 1200px) 780px, 100vw"
                    className="object-cover"
                  />
                </div>
              </figure>

              <ul className="blog-article__meta m-0 mb-7.5 flex list-none flex-wrap items-center gap-x-7.5 gap-y-3 border-b border-border/60 p-0 pb-7">
                {post.author ? (
                  <li className="flex items-center gap-2.5 text-base text-muted-foreground">
                    <i className="icon-user text-lg text-accent" aria-hidden="true" />
                    <Link
                      href={`/blog/author/${post.author.slug}`}
                      className="transition-colors duration-500 hover:text-accent"
                    >
                      {post.author.name}
                    </Link>
                  </li>
                ) : null}
                <li className="flex items-center gap-2.5 text-base text-muted-foreground">
                  <i className="icon-calendar text-lg text-accent" aria-hidden="true" />
                  <time dateTime={toIsoDate(post.publishedAt)}>
                    {formatLongDate(post.publishedAt)}
                  </time>
                </li>
                <li className="flex items-center gap-2.5 text-base text-muted-foreground">
                  <i className="icon-clock text-lg text-accent" aria-hidden="true" />
                  {post.readingMinutes} min read
                </li>
                <li className="flex items-center gap-2.5 text-base text-muted-foreground">
                  <i className="icon-comment text-lg text-accent" aria-hidden="true" />
                  <Link href="#comments" className="transition-colors duration-500 hover:text-accent">
                    Comments ({post.commentCount})
                  </Link>
                </li>
              </ul>

              {post.subtitle ? (
                <p className="mb-8 text-[20px] leading-[1.6] font-medium text-foreground max-sm:text-[18px]">
                  {post.subtitle}
                </p>
              ) : null}

              {post.keyTakeaways.length ? (
                <div className="post-takeaways mb-10">
                  <h2 className="mb-5 text-[20px] leading-tight font-bold text-foreground">
                    Key Takeaways
                  </h2>
                  <ul className="post-takeaways__list m-0 flex list-none flex-col gap-3.5 p-0 text-base leading-[1.7] text-muted-foreground">
                    {post.keyTakeaways.map((takeaway, index) => (
                      <li key={index}>{takeaway}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {headings.length >= 3 ? (
                <div className="mb-10 xl:hidden">
                  <PostToc entries={headings} />
                </div>
              ) : null}

              <PostContent html={post.contentHtml} />

              {post.faqs.length ? (
                <section className="mt-15">
                  <h2 className="mb-6 text-[28px] leading-tight font-bold text-foreground max-sm:text-[24px]">
                    Frequently Asked Questions
                  </h2>
                  <div className="rounded-[20px] border border-border bg-white px-7.5 max-sm:px-5">
                    {post.faqs.map((faq, index) => (
                      <details key={index} className="post-faq__item" name="post-faq">
                        <summary>{faq.question}</summary>
                        <p className="post-faq__answer">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ) : null}

              {post.sources.length ? (
                <section className="mt-12.5">
                  <h2 className="mb-5 text-[20px] leading-tight font-bold text-foreground">
                    Sources &amp; References
                  </h2>
                  <ul className="m-0 flex list-none flex-col gap-3 p-0">
                    {post.sources.map((source, index) => (
                      <li key={index} className="flex items-start gap-3 text-base">
                        <i
                          className="icon-right-2 mt-2 text-[10px] text-accent"
                          aria-hidden="true"
                        />
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-muted-foreground underline underline-offset-4 transition-colors duration-500 hover:text-accent"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {section.disclaimer ? (
                <p className="mt-12.5 rounded-[15px] border border-border/70 bg-secondary/40 px-7.5 py-6 text-[15px] leading-[1.7] text-muted-foreground max-sm:px-5">
                  <strong className="font-bold text-foreground">Disclaimer: </strong>
                  {section.disclaimer}
                </p>
              ) : null}

              <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-border/60 pt-8">
                {post.tags.length ? (
                  <ul className="m-0 flex list-none flex-wrap items-center gap-2.5 p-0">
                    <li className="pr-1 font-heading text-base font-bold text-foreground">Tags:</li>
                    {post.tags.map((tag) => (
                      <li key={tag.id}>
                        <Link
                          href={`/blog/tag/${tag.slug}`}
                          className="inline-block border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-500 hover:border-accent hover:bg-accent hover:text-white"
                        >
                          {tag.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span />
                )}
                <PostShare url={url} title={post.title} />
              </div>

              {post.author ? (
                <div className="mt-12.5">
                  <AuthorCard author={post.author} />
                </div>
              ) : null}

              <div className="mt-15">
                <CommentSection
                  postId={post.id}
                  comments={comments}
                  allowComments={commentsOpen}
                  moderated={section.moderateComments}
                />
              </div>
            </div>

            {section.showSidebar ? (
              <div className="min-w-0">
                <div className="blog-sidebar--sticky flex flex-col gap-7.5">
                  {headings.length >= 3 ? (
                    <div className="max-xl:hidden">
                      <PostToc entries={headings} />
                    </div>
                  ) : null}
                  <BlogSidebar
                    categories={categories}
                    tags={tags}
                    recentPosts={recentPosts.filter((item) => item.id !== post.id).slice(0, 3)}
                    showCategories={section.showCategories}
                    showTags={section.showTags}
                    activeCategorySlug={post.category?.slug}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </article>

      {related.length ? (
        <section className="blog-related bg-secondary/30 py-30 max-md:py-25 max-sm:py-20">
          <Container>
            <SectionHeading
              align="center"
              tagline="Related Reading"
              lines={["More From The", "Knowledge Desk."]}
            />
            <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} direction="up" delay={index * 100} duration={1300} className="h-full">
                  <PostCard post={item} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

    </>
  );
}
