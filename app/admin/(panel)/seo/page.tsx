import { getSessionUser } from "@/lib/auth";
import { SeoSettingsPageClient } from "@/components/admin/seo-settings-page-client";

export default async function SeoSettingsAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <SeoSettingsPageClient user={user} />;
}
