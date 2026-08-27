import { getSessionUser } from "@/lib/auth";
import { SeoStructuredDataPageClient } from "@/components/admin/seo-structured-data-page-client";

export default async function SeoStructuredDataAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <SeoStructuredDataPageClient user={user} />;
}
