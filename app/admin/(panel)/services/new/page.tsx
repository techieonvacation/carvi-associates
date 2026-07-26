import { getSessionUser } from "@/lib/auth";
import { ServiceEditorPageClient } from "@/components/admin/service-editor-page-client";

export default async function NewServicePage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <ServiceEditorPageClient user={user} />;
}
