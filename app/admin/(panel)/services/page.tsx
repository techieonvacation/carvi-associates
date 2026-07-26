import { getSessionUser } from "@/lib/auth";
import { ServicesPageClient } from "@/components/admin/services-page-client";

export default async function ServicesAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <ServicesPageClient user={user} />;
}
