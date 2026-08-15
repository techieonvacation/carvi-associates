import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { mapBlogComment } from "@/lib/cms/blog-mappers";
import { blogCommentModerationSchema } from "@/lib/cms/blog-schemas";

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = blogCommentModerationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { ids, action } = parsed.data;

  if (action === "delete") {
    await prisma.blogComment.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  }

  const data =
    action === "approve"
      ? { status: "APPROVED" as const, deletedAt: null }
      : action === "reject"
        ? { status: "REJECTED" as const }
        : action === "spam"
          ? { status: "SPAM" as const }
          : action === "pending"
            ? { status: "PENDING" as const }
            : action === "pin"
              ? { isPinned: true }
              : { isPinned: false };

  await prisma.blogComment.updateMany({ where: { id: { in: ids } }, data });

  const comments = await prisma.blogComment.findMany({
    where: { id: { in: ids } },
    include: { post: { select: { title: true, slug: true } } },
  });

  return NextResponse.json({ comments: comments.map(mapBlogComment) });
}
