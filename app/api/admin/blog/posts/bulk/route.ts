import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { adminPostInclude, takenPostSlugs, uniqueSlugFrom } from "@/lib/cms/blog-admin";
import { mapBlogPost, stripTrashPrefix } from "@/lib/cms/blog-mappers";
import { blogBulkSchema } from "@/lib/cms/blog-schemas";

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = blogBulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { ids, action } = parsed.data;

  if (action === "hard-delete") {
    await prisma.blogPost.deleteMany({
      where: { id: { in: ids }, deletedAt: { not: null } },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "duplicate") {
    const sources = await prisma.blogPost.findMany({
      where: { id: { in: ids }, deletedAt: null },
      include: { tags: { select: { tagId: true } } },
    });
    const maxOrder = await prisma.blogPost.aggregate({
      where: { deletedAt: null },
      _max: { displayOrder: true },
    });
    const taken = await takenPostSlugs();
    let nextOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    const created: string[] = [];

    for (const source of sources) {
      const slug = await uniqueSlugFrom(`${source.title}-copy`, taken);
      taken.add(slug);

      const copy = await prisma.blogPost.create({
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
          displayOrder: nextOrder,
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
          data: source.tags.map((link) => ({ postId: copy.id, tagId: link.tagId })),
          skipDuplicates: true,
        });
      }

      created.push(copy.id);
      nextOrder += 1;
    }

    const posts = await prisma.blogPost.findMany({
      where: { id: { in: created } },
      include: adminPostInclude,
    });
    return NextResponse.json({ posts: posts.map(mapBlogPost) });
  }

  if (action === "soft-delete" || action === "restore") {
    const rows = await prisma.blogPost.findMany({
      where: { id: { in: ids } },
      select: { id: true, slug: true },
    });
    const taken = await takenPostSlugs();

    for (const row of rows) {
      if (action === "soft-delete") {
        await prisma.blogPost.update({
          where: { id: row.id },
          data: {
            deletedAt: new Date(),
            isVisible: false,
            status: "ARCHIVED",
            slug: `trashed-${Date.now().toString(36)}-${row.slug}`.slice(0, 120),
          },
        });
        taken.delete(row.slug);
      } else {
        taken.delete(row.slug);
        const slug = await uniqueSlugFrom(stripTrashPrefix(row.slug), taken);
        taken.add(slug);
        await prisma.blogPost.update({
          where: { id: row.id },
          data: { deletedAt: null, status: "DRAFT", isVisible: false, slug },
        });
      }
    }

    const posts = await prisma.blogPost.findMany({
      where: { id: { in: ids } },
      include: adminPostInclude,
    });
    return NextResponse.json({ posts: posts.map(mapBlogPost) });
  }

  const data =
    action === "publish"
      ? { status: "PUBLISHED" as const, isVisible: true, isActive: true, publishedAt: new Date() }
      : action === "draft"
        ? { status: "DRAFT" as const, isVisible: false }
        : action === "archive"
          ? { status: "ARCHIVED" as const, isVisible: false }
          : action === "show"
            ? { isVisible: true }
            : action === "hide"
              ? { isVisible: false }
              : action === "activate"
                ? { isActive: true }
                : action === "deactivate"
                  ? { isActive: false }
                  : action === "feature"
                    ? { isFeatured: true }
                    : action === "unfeature"
                      ? { isFeatured: false }
                      : action === "pin"
                        ? { isPinned: true }
                        : action === "unpin"
                          ? { isPinned: false }
                          : null;

  if (!data) {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  await prisma.blogPost.updateMany({
    where: { id: { in: ids }, ...(action === "publish" ? { deletedAt: null } : {}) },
    data,
  });

  const posts = await prisma.blogPost.findMany({
    where: { id: { in: ids } },
    include: adminPostInclude,
  });

  return NextResponse.json({ posts: posts.map(mapBlogPost) });
}
