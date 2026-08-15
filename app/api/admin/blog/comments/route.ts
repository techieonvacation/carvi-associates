import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { mapBlogComment } from "@/lib/cms/blog-mappers";
import { BLOG_COMMENT_STATUSES } from "@/lib/cms/blog-types";

export async function GET(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const postId = searchParams.get("postId");
  const trash = searchParams.get("trash") === "true";

  const comments = await prisma.blogComment.findMany({
    where: {
      deletedAt: trash ? { not: null } : null,
      ...(status && (BLOG_COMMENT_STATUSES as readonly string[]).includes(status)
        ? { status: status as (typeof BLOG_COMMENT_STATUSES)[number] }
        : {}),
      ...(postId ? { postId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { post: { select: { title: true, slug: true } } },
  });

  const pendingCount = await prisma.blogComment.count({
    where: { status: "PENDING", deletedAt: null },
  });

  return NextResponse.json({
    comments: comments.map(mapBlogComment),
    pendingCount,
  });
}
