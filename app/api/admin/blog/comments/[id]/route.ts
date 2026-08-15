import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { mapBlogComment } from "@/lib/cms/blog-mappers";
import { blogCommentAdminUpdateSchema } from "@/lib/cms/blog-schemas";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.blogComment.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = blogCommentAdminUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const comment = await prisma.blogComment.update({
    where: { id },
    data: {
      ...(parsed.data.name ? { name: parsed.data.name.trim() } : {}),
      ...(parsed.data.body ? { body: parsed.data.body.trim() } : {}),
      ...(parsed.data.status ? { status: parsed.data.status } : {}),
      ...(parsed.data.isPinned !== undefined ? { isPinned: parsed.data.isPinned } : {}),
    },
    include: { post: { select: { title: true, slug: true } } },
  });

  return NextResponse.json({ comment: mapBlogComment(comment) });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const hard = searchParams.get("hard") === "true";

  const existing = await prisma.blogComment.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  if (hard) {
    await prisma.blogComment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  const comment = await prisma.blogComment.update({
    where: { id },
    data: { deletedAt: new Date() },
    include: { post: { select: { title: true, slug: true } } },
  });

  return NextResponse.json({ comment: mapBlogComment(comment) });
}
