import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const trash = searchParams.get("trash") === "true";

  const where: Prisma.MediaWhereInput = {
    deletedAt: trash ? { not: null } : null,
  };

  if (search) {
    where.OR = [
      { alt: { contains: search, mode: "insensitive" } },
      { caption: { contains: search, mode: "insensitive" } },
      { url: { contains: search, mode: "insensitive" } },
      { publicId: { contains: search, mode: "insensitive" } },
    ];
  }

  const media = await prisma.media.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ media });
}
