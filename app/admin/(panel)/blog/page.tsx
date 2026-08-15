import { getSessionUser } from "@/lib/auth";
import { BlogPageClient } from "@/components/admin/blog-page-client";

export default async function BlogAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <BlogPageClient user={user} />;
}
