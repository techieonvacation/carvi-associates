import { getSessionUser } from "@/lib/auth";
import { WhyChoosePageClient } from "@/components/admin/why-choose-page-client";

export default async function WhyChooseAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <WhyChoosePageClient user={user} />;
}
