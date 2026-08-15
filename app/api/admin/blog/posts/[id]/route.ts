import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { adminPostInclude, syncPostTags, takenPostSlugs } from "@/lib/cms/blog-admin";
import { blogPostWriteData, claimSlug, mapBlogPost } from "@/lib/cms/blog-mappers";
import { blogPostSchema } from "@/lib/cms/blog-schemas";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: adminPostInclude,
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post: mapBlogPost(post) });
}

export async function PUT(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const slug = claimSlug(parsed.data.slug, parsed.data.title, await takenPostSlugs(id));

  await prisma.blogPost.update({
    where: { id },
    data: blogPostWriteData(parsed.data, {
      slug,
      displayOrder: parsed.data.displayOrder ?? existing.displayOrder,
      existingPublishedAt: existing.publishedAt,
    }),
  });

  await syncPostTags(id, parsed.data.tagIds);

  const post = await prisma.blogPost.findUniqueOrThrow({
    where: { id },
    include: adminPostInclude,
  });

  return NextResponse.json({ post: mapBlogPost(post) });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const hard = searchParams.get("hard") === "true";

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (hard) {
    if (!existing.deletedAt) {
      return NextResponse.json(
        { error: "Move to trash before permanent delete" },
        { status: 400 },
      );
    }
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isVisible: false,
      status: "ARCHIVED",
      slug: `trashed-${Date.now().toString(36)}-${existing.slug}`.slice(0, 120),
    },
    include: adminPostInclude,
  });

  return NextResponse.json({ post: mapBlogPost(post) });
}
