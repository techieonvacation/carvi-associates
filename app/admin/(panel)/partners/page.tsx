import { getSessionUser } from "@/lib/auth";
import { PartnersPageClient } from "@/components/admin/partners-page-client";

export default async function PartnersPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <PartnersPageClient user={user} />;
}
