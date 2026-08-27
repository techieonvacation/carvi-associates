import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { mapSeoSettings } from "@/lib/seo/mappers";
import { resolveOrigin, toAbsoluteUrl } from "@/lib/seo/metadata";
import { indexNowSchema } from "@/lib/seo/schemas";

export async function POST(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const settingsRow = await prisma.seoSettings.findUnique({ where: { id: "default" } });
  const settings = mapSeoSettings(settingsRow as Record<string, unknown> | null);

  if (!settings.indexNowEnabled || !settings.indexNowKey.trim()) {
    return NextResponse.json(
      { error: "Enable IndexNow and set a key before submitting URLs" },
      { status: 400 },
    );
  }

  const body = await request.json();
  const parsed = indexNowSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const origin = resolveOrigin(settings);
  const host = origin.replace(/^https?:\/\//, "");
  const urlList = parsed.data.urls.map((url) => toAbsoluteUrl(settings, url));

  const submission = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: settings.indexNowKey.trim(),
      keyLocation: `${origin}/indexnow-key.txt`,
      urlList,
    }),
  }).catch(() => null);

  if (!submission) {
    return NextResponse.json({ error: "IndexNow endpoint unreachable" }, { status: 502 });
  }

  return NextResponse.json({
    ok: submission.ok,
    status: submission.status,
    submitted: urlList.length,
  });
}
