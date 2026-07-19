import { getSessionUser } from "@/lib/auth";
import { TopbarPageClient } from "@/components/admin/topbar-page-client";

export default async function TopbarPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <TopbarPageClient user={user} />;
}
