import { getSessionUser } from "@/lib/auth";
import { BlogPostEditorPageClient } from "@/components/admin/blog-post-editor-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPostPage({ params }: PageProps) {
  const user = await getSessionUser();
  if (!user) return null;
  const { id } = await params;
  return <BlogPostEditorPageClient user={user} postId={id} />;
}
