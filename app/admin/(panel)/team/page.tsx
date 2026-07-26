import { getSessionUser } from "@/lib/auth";
import { TeamPageClient } from "@/components/admin/team-page-client";

export default async function TeamAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <TeamPageClient user={user} />;
}
