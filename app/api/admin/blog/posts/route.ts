import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { adminPostInclude, syncPostTags, takenPostSlugs } from "@/lib/cms/blog-admin";
import { blogPostWriteData, claimSlug, mapBlogPost } from "@/lib/cms/blog-mappers";
import { blogPostSchema } from "@/lib/cms/blog-schemas";
import { BLOG_CONTENT_TYPES, BLOG_POST_STATUSES } from "@/lib/cms/blog-types";

export async function GET(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { searchParams } = new URL(request.url);
  const trash = searchParams.get("trash") === "true";
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const categoryId = searchParams.get("categoryId");

  const posts = await prisma.blogPost.findMany({
    where: {
      deletedAt: trash ? { not: null } : null,
      ...(status && (BLOG_POST_STATUSES as readonly string[]).includes(status)
        ? { status: status as (typeof BLOG_POST_STATUSES)[number] }
        : {}),
      ...(type && (BLOG_CONTENT_TYPES as readonly string[]).includes(type)
        ? { contentType: type as (typeof BLOG_CONTENT_TYPES)[number] }
        : {}),
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: trash
      ? { deletedAt: "desc" }
      : [{ isPinned: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    include: adminPostInclude,
  });

  return NextResponse.json({ posts: posts.map(mapBlogPost) });
}

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const maxOrder = await prisma.blogPost.aggregate({
    where: { deletedAt: null },
    _max: { displayOrder: true },
  });
  const slug = claimSlug(parsed.data.slug, parsed.data.title, await takenPostSlugs());

  const created = await prisma.blogPost.create({
    data: blogPostWriteData(parsed.data, {
      slug,
      displayOrder: parsed.data.displayOrder ?? (maxOrder._max.displayOrder ?? -1) + 1,
    }),
  });

  await syncPostTags(created.id, parsed.data.tagIds);

  const post = await prisma.blogPost.findUniqueOrThrow({
    where: { id: created.id },
    include: adminPostInclude,
  });

  return NextResponse.json({ post: mapBlogPost(post) }, { status: 201 });
}
