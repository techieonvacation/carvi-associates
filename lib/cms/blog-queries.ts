import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { defaultBlogSection } from "@/lib/cms/blog-defaults";
import {
  mapBlogAuthor,
  mapBlogCategory,
  mapBlogComment,
  mapBlogPost,
  mapBlogSection,
  mapBlogTag,
} from "@/lib/cms/blog-mappers";
import type {
  BlogArchiveFilters,
  BlogArchiveResult,
  BlogAuthorItem,
  BlogCategoryItem,
  BlogCommentItem,
  BlogContentType,
  BlogHomeContent,
  BlogPostItem,
  BlogSectionContent,
  BlogTagItem,
} from "@/lib/cms/blog-types";
import { BLOG_CONTENT_TYPES } from "@/lib/cms/blog-types";

const postInclude = {
  category: {
    select: { id: true, name: true, slug: true, accentColor: true, icon: true },
  },
  author: {
    select: {
      id: true,
      name: true,
      slug: true,
      role: true,
      credentials: true,
      avatarUrl: true,
      bio: true,
    },
  },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
  _count: { select: { comments: { where: { status: "APPROVED", deletedAt: null } } } },
} as const;

function publishedWhere() {
  return {
    status: "PUBLISHED" as const,
    isVisible: true,
    isActive: true,
    deletedAt: null,
    publishedAt: { lte: new Date() },
  };
}

const publishedOrder = [
  { isPinned: "desc" as const },
  { publishedAt: "desc" as const },
  { createdAt: "desc" as const },
];

export const getBlogSection = cache(async (): Promise<BlogSectionContent> => {
  const row = await prisma.blogSectionSettings.findUnique({ where: { id: "default" } });
  return row ? mapBlogSection(row) : defaultBlogSection;
});

export const getHomeBlog = cache(async (): Promise<BlogHomeContent> => {
  const section = await getBlogSection();

  const rows = await prisma.blogPost.findMany({
    where: publishedWhere(),
    orderBy: publishedOrder,
    take: Math.max(1, section.homeLimit),
    include: postInclude,
  });

  return { section, posts: rows.map(mapBlogPost) };
});

export function parseContentTypeFilter(value: string | undefined): BlogContentType | undefined {
  if (!value) return undefined;
  const upper = value.toUpperCase();
  return (BLOG_CONTENT_TYPES as readonly string[]).includes(upper)
    ? (upper as BlogContentType)
    : undefined;
}

export async function getBlogArchive(
  filters: BlogArchiveFilters = {},
): Promise<BlogArchiveResult> {
  const section = await getBlogSection();
  const perPage = Math.min(48, Math.max(3, filters.perPage ?? section.postsPerPage));
  const page = Math.max(1, filters.page ?? 1);
  const search = filters.search?.trim();

  const where = {
    ...publishedWhere(),
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.author ? { author: { slug: filters.author } } : {}),
    ...(filters.tag ? { tags: { some: { tag: { slug: filters.tag } } } } : {}),
    ...(filters.type ? { contentType: filters.type } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } },
            { subtitle: { contains: search, mode: "insensitive" as const } },
            { category: { name: { contains: search, mode: "insensitive" as const } } },
            { tags: { some: { tag: { name: { contains: search, mode: "insensitive" as const } } } } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      orderBy: publishedOrder,
      skip: (page - 1) * perPage,
      take: perPage,
      include: postInclude,
    }),
  ]);

  return {
    posts: rows.map(mapBlogPost),
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostItem | null> => {
  const row = await prisma.blogPost.findFirst({
    where: { slug, ...publishedWhere() },
    include: postInclude,
  });
  return row ? mapBlogPost(row) : null;
});

export async function getRelatedPosts(
  post: BlogPostItem,
  limit = 3,
): Promise<BlogPostItem[]> {
  const tagIds = post.tags.map((tag) => tag.id);

  const rows = await prisma.blogPost.findMany({
    where: {
      ...publishedWhere(),
      id: { not: post.id },
      ...(post.categoryId || tagIds.length
        ? {
            OR: [
              ...(post.categoryId ? [{ categoryId: post.categoryId }] : []),
              ...(tagIds.length ? [{ tags: { some: { tagId: { in: tagIds } } } }] : []),
            ],
          }
        : {}),
    },
    orderBy: publishedOrder,
    take: limit,
    include: postInclude,
  });

  if (rows.length >= limit) return rows.map(mapBlogPost);

  const filler = await prisma.blogPost.findMany({
    where: {
      ...publishedWhere(),
      id: { notIn: [post.id, ...rows.map((row) => row.id)] },
    },
    orderBy: publishedOrder,
    take: limit - rows.length,
    include: postInclude,
  });

  return [...rows, ...filler].map(mapBlogPost);
}

export const getBlogCategories = cache(async (): Promise<BlogCategoryItem[]> => {
  const rows = await prisma.blogCategory.findMany({
    where: { deletedAt: null, isVisible: true, isActive: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { posts: { where: publishedWhere() } } } },
  });
  return rows.map(mapBlogCategory);
});

export const getBlogTags = cache(async (): Promise<BlogTagItem[]> => {
  const rows = await prisma.blogTag.findMany({
    where: { deletedAt: null, isVisible: true, isActive: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: { where: { post: publishedWhere() } } } } },
  });
  return rows.map(mapBlogTag).filter((tag) => (tag.postCount ?? 0) > 0);
});

export const getBlogAuthors = cache(async (): Promise<BlogAuthorItem[]> => {
  const rows = await prisma.blogAuthor.findMany({
    where: { deletedAt: null, isVisible: true, isActive: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { posts: { where: publishedWhere() } } } },
  });
  return rows.map(mapBlogAuthor);
});

export const getBlogCategoryBySlug = cache(
  async (slug: string): Promise<BlogCategoryItem | null> => {
    const row = await prisma.blogCategory.findFirst({
      where: { slug, deletedAt: null, isVisible: true, isActive: true },
      include: { _count: { select: { posts: { where: publishedWhere() } } } },
    });
    return row ? mapBlogCategory(row) : null;
  },
);

export const getBlogTagBySlug = cache(async (slug: string): Promise<BlogTagItem | null> => {
  const row = await prisma.blogTag.findFirst({
    where: { slug, deletedAt: null, isVisible: true, isActive: true },
    include: { _count: { select: { posts: { where: { post: publishedWhere() } } } } },
  });
  return row ? mapBlogTag(row) : null;
});

export const getBlogAuthorBySlug = cache(async (slug: string): Promise<BlogAuthorItem | null> => {
  const row = await prisma.blogAuthor.findFirst({
    where: { slug, deletedAt: null, isVisible: true, isActive: true },
    include: { _count: { select: { posts: { where: publishedWhere() } } } },
  });
  return row ? mapBlogAuthor(row) : null;
});

export const getRecentBlogPosts = cache(async (limit = 4): Promise<BlogPostItem[]> => {
  const rows = await prisma.blogPost.findMany({
    where: publishedWhere(),
    orderBy: publishedOrder,
    take: limit,
    include: postInclude,
  });
  return rows.map(mapBlogPost);
});

export const getFeaturedBlogPost = cache(async (): Promise<BlogPostItem | null> => {
  const row =
    (await prisma.blogPost.findFirst({
      where: { ...publishedWhere(), isFeatured: true },
      orderBy: publishedOrder,
      include: postInclude,
    })) ??
    (await prisma.blogPost.findFirst({
      where: publishedWhere(),
      orderBy: publishedOrder,
      include: postInclude,
    }));

  return row ? mapBlogPost(row) : null;
});

export async function getPostComments(postId: string): Promise<BlogCommentItem[]> {
  const rows = await prisma.blogComment.findMany({
    where: { postId, status: "APPROVED", deletedAt: null },
    orderBy: [{ isPinned: "desc" }, { createdAt: "asc" }],
  });

  const mapped = rows.map(mapBlogComment);
  const roots = mapped.filter((comment) => !comment.parentId);
  const byParent = new Map<string, BlogCommentItem[]>();

  for (const comment of mapped) {
    if (!comment.parentId) continue;
    const bucket = byParent.get(comment.parentId) ?? [];
    bucket.push(comment);
    byParent.set(comment.parentId, bucket);
  }

  return roots.map((root) => ({ ...root, replies: byParent.get(root.id) ?? [] }));
}

export async function getPublishedPostRefs() {
  return prisma.blogPost.findMany({
    where: { ...publishedWhere(), noIndex: false },
    orderBy: publishedOrder,
    select: { slug: true, updatedAt: true, publishedAt: true },
  });
}
