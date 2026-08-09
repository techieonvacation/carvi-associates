import { getSessionUser } from "@/lib/auth";
import { MarqueePageClient } from "@/components/admin/marquee-page-client";

export default async function MarqueeAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <MarqueePageClient user={user} />;
}
