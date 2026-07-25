import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { featuresPayloadSchema } from "@/lib/cms/schemas";
import { defaultFeatures } from "@/lib/cms/defaults";

export async function GET() {
  const features = await prisma.feature.findMany({ orderBy: { sortOrder: "asc" } });

  return NextResponse.json({
    features: features.length
      ? features
      : defaultFeatures.map((feature, index) => ({
          id: `fallback-${index}`,
          ...feature,
        })),
  });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = featuresPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const features = await prisma.$transaction(async (tx) => {
    await tx.feature.deleteMany();
    await tx.feature.createMany({
      data: parsed.data.features.map((feature, index) => ({
        icon: feature.icon,
        title: feature.title,
        text: feature.text,
        href: feature.href || "#",
        sortOrder: index,
        visible: feature.visible,
      })),
    });

    return tx.feature.findMany({ orderBy: { sortOrder: "asc" } });
  });

  return NextResponse.json({ features });
}
