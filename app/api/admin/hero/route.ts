import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

const heroSchema = z.object({
  tagline: z.string().min(1),
  titleBeforeVideo: z.string().min(1),
  titleHighlight: z.string().min(1),
  titleAfterVideo: z.string().min(1),
  ctaText: z.string().min(1),
  ctaHref: z.string().min(1),
  videoId: z.string().optional().nullable(),
  heroImageUrl: z.string().min(1),
  activeUserCount: z.number().int().min(0),
  activeUserSuffix: z.string().min(1),
  activeUserLabel: z.string().min(1),
  activeUserImages: z.array(z.string().min(1)),
});

export async function GET() {
  const hero = await prisma.heroSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json({ hero });
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
    },
    create: {
      id: "default",
      ...parsed.data,
      videoId: parsed.data.videoId ?? null,
      activeUserImages: parsed.data.activeUserImages,
    },
  });

  return NextResponse.json({ hero });
}
