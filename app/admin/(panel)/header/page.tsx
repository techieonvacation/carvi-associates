import { getSessionUser } from "@/lib/auth";
import { HeaderPageClient } from "@/components/admin/header-page-client";

export default async function HeaderPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <HeaderPageClient user={user} />;
}
