import { injectHeadingIds } from "@/lib/cms/blog-sanitize";

export function PostContent({ html }: { html: string }) {
  if (!html.trim()) return null;

  return (
    <div
      className="post-content"
      dangerouslySetInnerHTML={{ __html: injectHeadingIds(html) }}
    />
  );
}
