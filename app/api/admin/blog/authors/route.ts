import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { takenAuthorSlugs } from "@/lib/cms/blog-admin";
import { blogAuthorWriteData, claimSlug, mapBlogAuthor } from "@/lib/cms/blog-mappers";
import { blogAuthorSchema } from "@/lib/cms/blog-schemas";

const withCount = { _count: { select: { posts: true } } } as const;

export async function GET() {
  const authors = await prisma.blogAuthor.findMany({
    where: { deletedAt: null },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: withCount,
  });

  return NextResponse.json({ authors: authors.map(mapBlogAuthor) });
}

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = blogAuthorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const maxOrder = await prisma.blogAuthor.aggregate({
    where: { deletedAt: null },
    _max: { displayOrder: true },
  });
  const slug = claimSlug(parsed.data.slug, parsed.data.name, await takenAuthorSlugs());

  const author = await prisma.blogAuthor.create({
    data: blogAuthorWriteData(
      parsed.data,
      slug,
      parsed.data.displayOrder ?? (maxOrder._max.displayOrder ?? -1) + 1,
    ),
    include: withCount,
  });

  return NextResponse.json({ author: mapBlogAuthor(author) }, { status: 201 });
}
