import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { adminPostInclude } from "@/lib/cms/blog-admin";
import { mapBlogPost } from "@/lib/cms/blog-mappers";
import { blogReorderSchema } from "@/lib/cms/blog-schemas";

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = blogReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.$transaction(
    parsed.data.orderedIds.map((id, index) =>
      prisma.blogPost.update({ where: { id }, data: { displayOrder: index } }),
    ),
  );

  const posts = await prisma.blogPost.findMany({
    where: { deletedAt: null },
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    include: adminPostInclude,
  });

  return NextResponse.json({ posts: posts.map(mapBlogPost) });
}
