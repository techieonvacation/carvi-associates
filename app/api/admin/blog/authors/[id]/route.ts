import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { takenAuthorSlugs } from "@/lib/cms/blog-admin";
import { blogAuthorWriteData, claimSlug, mapBlogAuthor } from "@/lib/cms/blog-mappers";
import { blogAuthorSchema } from "@/lib/cms/blog-schemas";

const withCount = { _count: { select: { posts: true } } } as const;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.blogAuthor.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = blogAuthorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const slug = claimSlug(
    parsed.data.slug || existing.slug,
    parsed.data.name,
    await takenAuthorSlugs(id),
  );

  const author = await prisma.blogAuthor.update({
    where: { id },
    data: blogAuthorWriteData(
      parsed.data,
      slug,
      parsed.data.displayOrder ?? existing.displayOrder,
    ),
    include: withCount,
  });

  return NextResponse.json({ author: mapBlogAuthor(author) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.blogAuthor.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  const author = await prisma.blogAuthor.update({
    where: { id },
    data: { deletedAt: new Date(), isVisible: false, isActive: false },
    include: withCount,
  });

  return NextResponse.json({ author: mapBlogAuthor(author) });
}
