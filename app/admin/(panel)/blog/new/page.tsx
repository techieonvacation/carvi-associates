import { getSessionUser } from "@/lib/auth";
import { BlogPostEditorPageClient } from "@/components/admin/blog-post-editor-client";

export default async function NewBlogPostPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <BlogPostEditorPageClient user={user} />;
}
