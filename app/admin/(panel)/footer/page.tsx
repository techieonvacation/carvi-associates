import { getSessionUser } from "@/lib/auth";
import { FooterPageClient } from "@/components/admin/footer-page-client";

export default async function FooterAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <FooterPageClient user={user} />;
}
