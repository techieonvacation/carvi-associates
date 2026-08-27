import { getSessionUser } from "@/lib/auth";
import { SeoTechnicalPageClient } from "@/components/admin/seo-technical-page-client";

export default async function SeoTechnicalAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <SeoTechnicalPageClient user={user} />;
}
