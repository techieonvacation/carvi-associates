import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/cms/service-mappers";

export const adminPostInclude = {
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
  _count: { select: { comments: { where: { deletedAt: null } } } },
} as const;

export async function takenPostSlugs(excludeId?: string) {
  const rows = await prisma.blogPost.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return new Set(rows.map((row) => row.slug));
}

export async function takenCategorySlugs(excludeId?: string) {
  const rows = await prisma.blogCategory.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return new Set(rows.map((row) => row.slug));
}

export async function takenTagSlugs(excludeId?: string) {
  const rows = await prisma.blogTag.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return new Set(rows.map((row) => row.slug));
}

export async function takenAuthorSlugs(excludeId?: string) {
  const rows = await prisma.blogAuthor.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return new Set(rows.map((row) => row.slug));
}

export async function syncPostTags(postId: string, tagIds: string[]) {
  const unique = [...new Set(tagIds)];

  const valid = unique.length
    ? await prisma.blogTag.findMany({
        where: { id: { in: unique }, deletedAt: null },
        select: { id: true },
      })
    : [];

  await prisma.blogPostTag.deleteMany({ where: { postId } });

  if (valid.length) {
    await prisma.blogPostTag.createMany({
      data: valid.map((tag) => ({ postId, tagId: tag.id })),
      skipDuplicates: true,
    });
  }
}

export async function uniqueSlugFrom(
  base: string,
  taken: Set<string>,
  fallback = "post",
) {
  const root = slugify(base) || fallback;
  let candidate = root;
  let counter = 2;
  while (taken.has(candidate)) {
    candidate = `${root}-${counter}`;
    counter += 1;
  }
  return candidate;
}
