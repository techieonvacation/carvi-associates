import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { takenTagSlugs } from "@/lib/cms/blog-admin";
import { blogTagWriteData, claimSlug, mapBlogTag } from "@/lib/cms/blog-mappers";
import { blogTagSchema } from "@/lib/cms/blog-schemas";

const withCount = { _count: { select: { posts: true } } } as const;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.blogTag.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = blogTagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const slug = claimSlug(
    parsed.data.slug || existing.slug,
    parsed.data.name,
    await takenTagSlugs(id),
  );

  const tag = await prisma.blogTag.update({
    where: { id },
    data: blogTagWriteData(parsed.data, slug),
    include: withCount,
  });

  return NextResponse.json({ tag: mapBlogTag(tag) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { id } = await context.params;
  const existing = await prisma.blogTag.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 });
  }

  await prisma.blogTag.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
