import { getSeoSettings } from "@/lib/seo/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSeoSettings();

  if (!settings.indexNowEnabled || !settings.indexNowKey.trim()) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(settings.indexNowKey.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
