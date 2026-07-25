import { getSessionUser } from "@/lib/auth";
import { FeaturesPageClient } from "@/components/admin/features-page-client";

export default async function FeaturesPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <FeaturesPageClient user={user} />;
}
