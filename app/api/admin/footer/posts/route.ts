import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultFooterRecentPosts } from "@/lib/cms/defaults";
import { footerRecentPostsPayloadSchema } from "@/lib/cms/schemas";
import { mapFooterRecentPost } from "@/lib/cms/queries";

export async function GET() {
  const posts = await prisma.footerRecentPost.findMany({
    where: { deletedAt: null },
    orderBy: { displayOrder: "asc" },
  });

  if (!posts.length) {
    return NextResponse.json({
      posts: defaultFooterRecentPosts.map((post, index) => ({
        id: `fallback-${index}`,
        ...post,
      })),
    });
  }

  return NextResponse.json({ posts: posts.map(mapFooterRecentPost) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const parsed = footerRecentPostsPayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const posts = await prisma.$transaction(async (tx) => {
    const existing = await tx.footerRecentPost.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });
    const keepIds = new Set(
      parsed.data.posts.map((post) => post.id).filter((id): id is string => Boolean(id)),
    );
    const toTrash = existing.filter((row) => !keepIds.has(row.id)).map((row) => row.id);
    if (toTrash.length) {
      await tx.footerRecentPost.updateMany({
        where: { id: { in: toTrash } },
        data: { deletedAt: new Date(), isVisible: false },
      });
    }

    const saved = [];
    for (const [index, post] of parsed.data.posts.entries()) {
      const data = {
        title: post.title.trim(),
        dateLabel: post.dateLabel.trim(),
        imageUrl: post.imageUrl.trim(),
        imageAlt: post.imageAlt.trim() || post.title.trim(),
        href: post.href.trim() || "#",
        displayOrder: index,
        isVisible: post.isVisible,
        isActive: post.isActive,
        deletedAt: null,
      };

      if (post.id && !post.id.startsWith("fallback-") && !post.id.startsWith("new-")) {
        saved.push(await tx.footerRecentPost.update({ where: { id: post.id }, data }));
      } else {
        saved.push(await tx.footerRecentPost.create({ data }));
      }
    }

    return saved.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  return NextResponse.json({ posts: posts.map(mapFooterRecentPost) });
}
