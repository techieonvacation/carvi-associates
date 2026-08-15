import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { takenTagSlugs } from "@/lib/cms/blog-admin";
import { blogTagWriteData, claimSlug, mapBlogTag } from "@/lib/cms/blog-mappers";
import { blogTagSchema } from "@/lib/cms/blog-schemas";

const withCount = { _count: { select: { posts: true } } } as const;

export async function GET() {
  const tags = await prisma.blogTag.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: withCount,
  });

  return NextResponse.json({ tags: tags.map(mapBlogTag) });
}

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = blogTagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const slug = claimSlug(parsed.data.slug, parsed.data.name, await takenTagSlugs());

  const tag = await prisma.blogTag.create({
    data: blogTagWriteData(parsed.data, slug),
    include: withCount,
  });

  return NextResponse.json({ tag: mapBlogTag(tag) }, { status: 201 });
}
