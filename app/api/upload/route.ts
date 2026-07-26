import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const alt = String(formData.get("alt") ?? "").trim();
    const folder = String(formData.get("folder") ?? "carvi").trim() || "carvi";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, file.name, folder);

    const media = await prisma.media.create({
      data: {
        url: result.url,
        publicId: result.publicId,
        alt: alt || file.name.replace(/\.[^/.]+$/, ""),
        mimeType: file.type || null,
        folder,
      },
    });

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      mediaId: media.id,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
