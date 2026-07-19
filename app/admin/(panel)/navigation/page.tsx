import { getSessionUser } from "@/lib/auth";
import { NavigationPageClient } from "@/components/admin/navigation-page-client";

export default async function NavigationPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <NavigationPageClient user={user} />;
}
