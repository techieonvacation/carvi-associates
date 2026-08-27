import { getSessionUser } from "@/lib/auth";
import { SeoScriptsPageClient } from "@/components/admin/seo-scripts-page-client";

export default async function SeoScriptsAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <SeoScriptsPageClient user={user} />;
}
