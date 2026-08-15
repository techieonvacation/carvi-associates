import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { adminPostInclude, takenPostSlugs, uniqueSlugFrom } from "@/lib/cms/blog-admin";
import { mapBlogPost, stripTrashPrefix } from "@/lib/cms/blog-mappers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const slug = await uniqueSlugFrom(
    stripTrashPrefix(existing.slug),
    await takenPostSlugs(id),
  );

  const post = await prisma.blogPost.update({
    where: { id },
    data: { deletedAt: null, status: "DRAFT", isVisible: false, slug },
    include: adminPostInclude,
  });

  return NextResponse.json({ post: mapBlogPost(post) });
}
