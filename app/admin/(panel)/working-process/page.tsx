import { getSessionUser } from "@/lib/auth";
import { WorkingProcessPageClient } from "@/components/admin/working-process-page-client";

export default async function WorkingProcessAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <WorkingProcessPageClient user={user} />;
}
