import { getSeoRobotsRules, getSeoSettings } from "@/lib/seo/queries";
import { buildRobotsTxt } from "@/lib/seo/robots";

export const dynamic = "force-dynamic";

export async function GET() {
  const [settings, rules] = await Promise.all([getSeoSettings(), getSeoRobotsRules()]);
  const body = buildRobotsTxt(settings, rules);

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
