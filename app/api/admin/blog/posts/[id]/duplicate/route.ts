import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { adminPostInclude, takenPostSlugs, uniqueSlugFrom } from "@/lib/cms/blog-admin";
import { mapBlogPost } from "@/lib/cms/blog-mappers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const source = await prisma.blogPost.findUnique({
    where: { id },
    include: { tags: { select: { tagId: true } } },
  });

  if (!source || source.deletedAt) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const maxOrder = await prisma.blogPost.aggregate({
    where: { deletedAt: null },
    _max: { displayOrder: true },
  });
  const slug = await uniqueSlugFrom(`${source.title}-copy`, await takenPostSlugs());

  const created = await prisma.blogPost.create({
    data: {
      title: `${source.title} (Copy)`,
      slug,
      subtitle: source.subtitle,
      excerpt: source.excerpt,
      contentHtml: source.contentHtml,
      keyTakeaways: source.keyTakeaways ?? [],
      faqs: source.faqs ?? [],
      sources: source.sources ?? [],
      coverImageUrl: source.coverImageUrl,
      coverImageAlt: source.coverImageAlt,
      thumbnailUrl: source.thumbnailUrl,
      contentType: source.contentType,
      status: "DRAFT",
      categoryId: source.categoryId,
      authorId: source.authorId,
      readingMinutes: source.readingMinutes,
      displayOrder: (maxOrder._max.displayOrder ?? -1) + 1,
      isFeatured: false,
      isPinned: false,
      allowComments: source.allowComments,
      isVisible: false,
      isActive: false,
      publishedAt: null,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      seoKeywords: source.seoKeywords,
      canonicalUrl: null,
      ogImageUrl: source.ogImageUrl,
      twitterImageUrl: source.twitterImageUrl,
      noIndex: source.noIndex,
    },
  });

  if (source.tags.length) {
    await prisma.blogPostTag.createMany({
      data: source.tags.map((link) => ({ postId: created.id, tagId: link.tagId })),
      skipDuplicates: true,
    });
  }

  const post = await prisma.blogPost.findUniqueOrThrow({
    where: { id: created.id },
    include: adminPostInclude,
  });

  return NextResponse.json({ post: mapBlogPost(post) }, { status: 201 });
}
