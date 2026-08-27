import { getSessionUser } from "@/lib/auth";
import { SeoAuditPageClient } from "@/components/admin/seo-audit-page-client";

export default async function SeoAuditAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <SeoAuditPageClient user={user} />;
}
