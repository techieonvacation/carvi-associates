import { getSessionUser } from "@/lib/auth";
import { ProjectsPageClient } from "@/components/admin/projects-page-client";

export default async function ProjectsAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <ProjectsPageClient user={user} />;
}
