import { getSessionUser } from "@/lib/auth";
import { ServiceEditorPageClient } from "@/components/admin/service-editor-page-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({ params }: PageProps) {
  const user = await getSessionUser();
  if (!user) return null;
  const { id } = await params;
  return <ServiceEditorPageClient user={user} serviceId={id} />;
}
