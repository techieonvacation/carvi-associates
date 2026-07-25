import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { heroSchema } from "@/lib/cms/schemas";
import { defaultHero } from "@/lib/cms/defaults";

export async function GET() {
  const hero = await prisma.heroSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json({
    hero: hero ?? {
      id: "default",
      ...defaultHero,
    },
  });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = heroSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const hero = await prisma.heroSettings.upsert({
    where: { id: "default" },
    update: {
      ...parsed.data,
      videoId: parsed.data.videoId ?? null,
      activeUserImages: parsed.data.activeUserImages,
      stats: parsed.data.stats,
      trust: parsed.data.trust,
    },
    create: {
      id: "default",
      ...parsed.data,
      videoId: parsed.data.videoId ?? null,
      activeUserImages: parsed.data.activeUserImages,
      stats: parsed.data.stats,
      trust: parsed.data.trust,
    },
  });

  return NextResponse.json({ hero });
}
