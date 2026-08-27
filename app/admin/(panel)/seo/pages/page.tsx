import { getSessionUser } from "@/lib/auth";
import { SeoPagesPageClient } from "@/components/admin/seo-pages-page-client";
import { getSeoSettings } from "@/lib/seo/queries";
import { resolveOrigin } from "@/lib/seo/metadata";

export default async function SeoPagesAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const settings = await getSeoSettings();
  return <SeoPagesPageClient user={user} siteUrl={resolveOrigin(settings)} />;
}
