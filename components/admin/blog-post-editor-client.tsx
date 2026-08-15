"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BLOG_CONTENT_TYPES,
  BLOG_CONTENT_TYPE_META,
  BLOG_POST_STATUSES,
  type BlogAuthorItem,
  type BlogCategoryItem,
  type BlogContentType,
  type BlogFaq,
  type BlogPostItem,
  type BlogPostStatus,
  type BlogSource,
  type BlogTagItem,
} from "@/lib/cms/types";
import { estimateReadingMinutes } from "@/lib/cms/blog-sanitize";
import { cn } from "@/lib/utils";

type PostForm = {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  contentHtml: string;
  keyTakeaways: string[];
  faqs: BlogFaq[];
  sources: BlogSource[];
  coverImageUrl: string;
  coverImageAlt: string;
  thumbnailUrl: string;
  contentType: BlogContentType;
  status: BlogPostStatus;
  categoryId: string;
  authorId: string;
  tagIds: string[];
  publishedAt: string;
  isFeatured: boolean;
  isPinned: boolean;
  allowComments: boolean;
  isVisible: boolean;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  twitterImageUrl: string;
  noIndex: boolean;
};

const NONE = "__none__";

const emptyForm: PostForm = {
  title: "",
  slug: "",
  subtitle: "",
  excerpt: "",
  contentHtml: "",
  keyTakeaways: [],
  faqs: [],
  sources: [],
  coverImageUrl: "",
  coverImageAlt: "",
  thumbnailUrl: "",
  contentType: "BLOG",
  status: "DRAFT",
  categoryId: "",
  authorId: "",
  tagIds: [],
  publishedAt: "",
  isFeatured: false,
  isPinned: false,
  allowComments: true,
  isVisible: true,
  isActive: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  canonicalUrl: "",
  ogImageUrl: "",
  twitterImageUrl: "",
  noIndex: false,
};

function toLocalInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function fromForm(post: BlogPostItem): PostForm {
  return {
    title: post.title,
    slug: post.slug,
    subtitle: post.subtitle ?? "",
    excerpt: post.excerpt,
    contentHtml: post.contentHtml,
    keyTakeaways: post.keyTakeaways,
    faqs: post.faqs,
    sources: post.sources,
    coverImageUrl: post.coverImageUrl,
    coverImageAlt: post.coverImageAlt,
    thumbnailUrl: post.thumbnailUrl ?? "",
    contentType: post.contentType,
    status: post.status,
    categoryId: post.categoryId ?? "",
    authorId: post.authorId ?? "",
    tagIds: post.tags.map((tag) => tag.id),
    publishedAt: toLocalInput(post.publishedAt),
    isFeatured: post.isFeatured,
    isPinned: post.isPinned,
    allowComments: post.allowComments,
    isVisible: post.isVisible,
    isActive: post.isActive,
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
    seoKeywords: post.seoKeywords ?? "",
    canonicalUrl: post.canonicalUrl ?? "",
    ogImageUrl: post.ogImageUrl ?? "",
    twitterImageUrl: post.twitterImageUrl ?? "",
    noIndex: post.noIndex,
  };
}

export function BlogPostEditorPageClient({
  user,
  postId,
}: {
  user: { name: string; email: string; role: "ADMIN" | "MANAGER" };
  postId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [authors, setAuthors] = useState<BlogAuthorItem[]>([]);
  const [tags, setTags] = useState<BlogTagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  const set = useCallback(
    <K extends keyof PostForm>(key: K, value: PostForm[K]) =>
      setForm((current) => ({ ...current, [key]: value })),
    [],
  );

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const [categoriesRes, authorsRes, tagsRes, postRes] = await Promise.all([
          fetch("/api/admin/blog/categories"),
          fetch("/api/admin/blog/authors"),
          fetch("/api/admin/blog/tags"),
          postId ? fetch(`/api/admin/blog/posts/${postId}`) : Promise.resolve(null),
        ]);

        const [categoriesData, authorsData, tagsData] = await Promise.all([
          categoriesRes.json(),
          authorsRes.json(),
          tagsRes.json(),
        ]);
        if (!active) return;

        setCategories(categoriesData.categories ?? []);
        setAuthors(authorsData.authors ?? []);
        setTags(tagsData.tags ?? []);

        if (postRes) {
          const postData = await postRes.json();
          if (!postRes.ok) throw new Error(postData.error ?? "Post not found");
          if (!active) return;
          setForm(fromForm(postData.post));
          setSavedSlug(postData.post.slug);
        }
      } catch (error) {
        if (active) toast.error(error instanceof Error ? error.message : "Failed to load post");
      } finally {
        if (active) setLoading(false);
      }
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, [postId]);

  const readingMinutes = useMemo(
    () => estimateReadingMinutes(form.contentHtml, form.excerpt),
    [form.contentHtml, form.excerpt],
  );

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        subtitle: form.subtitle || null,
        excerpt: form.excerpt,
        contentHtml: form.contentHtml,
        keyTakeaways: form.keyTakeaways.filter((item) => item.trim()),
        faqs: form.faqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
        sources: form.sources.filter((source) => source.label.trim() && source.url.trim()),
        coverImageUrl: form.coverImageUrl,
        coverImageAlt: form.coverImageAlt,
        thumbnailUrl: form.thumbnailUrl || null,
        contentType: form.contentType,
        status: form.status,
        categoryId: form.categoryId || null,
        authorId: form.authorId || null,
        tagIds: form.tagIds,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        isFeatured: form.isFeatured,
        isPinned: form.isPinned,
        allowComments: form.allowComments,
        isVisible: form.isVisible,
        isActive: form.isActive,
        seoTitle: form.seoTitle || null,
        seoDescription: form.seoDescription || null,
        seoKeywords: form.seoKeywords || null,
        canonicalUrl: form.canonicalUrl || null,
        ogImageUrl: form.ogImageUrl || null,
        twitterImageUrl: form.twitterImageUrl || null,
        noIndex: form.noIndex,
      };

      const response = await fetch(
        postId ? `/api/admin/blog/posts/${postId}` : "/api/admin/blog/posts",
        {
          method: postId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");

      toast.success(postId ? "Post updated" : "Post created");
      setSavedSlug(data.post.slug);
      setForm(fromForm(data.post));

      if (!postId) router.push(`/admin/blog/${data.post.id}`);
      else router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <AdminHeader user={user} title={postId ? "Edit post" : "New post"} />
        <main className="flex flex-1 items-center justify-center p-6">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        user={user}
        title={postId ? "Edit post" : "New post"}
        description={form.title || "Write and publish a blog article"}
      />

      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" nativeButton={false} render={<Link href="/admin/blog" />}>
            <ArrowLeft className="size-4" />
            Back to posts
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{readingMinutes} min read</Badge>
            <Badge variant={form.status === "PUBLISHED" ? "default" : "secondary"}>
              {form.status}
            </Badge>
            {savedSlug ? (
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href={`/blog/${savedSlug}`} target="_blank" />}
              >
                <ExternalLink className="size-4" />
                View on site
              </Button>
            ) : null}
          </div>
        </div>

        <form onSubmit={save} className="space-y-6">
          <Tabs defaultValue="content">
            <TabsList className="flex-wrap">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="extras">Takeaways & FAQ</TabsTrigger>
              <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="publish">Publishing</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-4">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Headline & summary</CardTitle>
                  <CardDescription>
                    What appears on the cards, the search results and the social preview.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      required
                      value={form.title}
                      onChange={(event) => set("title", event.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Slug</Label>
                      <Input
                        value={form.slug}
                        placeholder="auto-generated-from-title"
                        onChange={(event) => set("slug", event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Lowercase letters, numbers and hyphens. Leave blank to derive it from the
                        title. Changing it breaks existing links.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle (optional)</Label>
                      <Input
                        value={form.subtitle}
                        onChange={(event) => set("subtitle", event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Excerpt *</Label>
                    <Textarea
                      required
                      rows={3}
                      maxLength={500}
                      value={form.excerpt}
                      onChange={(event) => set("excerpt", event.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {form.excerpt.length}/500 — also used as the meta description when the SEO
                      field is empty.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <ImageField
                      label="Cover image *"
                      value={form.coverImageUrl}
                      onChange={(value) => set("coverImageUrl", value)}
                    />
                    <ImageField
                      label="Card thumbnail (optional)"
                      value={form.thumbnailUrl}
                      onChange={(value) => set("thumbnailUrl", value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cover image alt text</Label>
                    <Input
                      value={form.coverImageAlt}
                      placeholder="Describe the image for screen readers"
                      onChange={(event) => set("coverImageAlt", event.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="body" className="mt-4">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Article body</CardTitle>
                  <CardDescription>
                    Headings, lists, tables, quotes, links, images and video embeds. Markdown
                    shortcuts work as you type.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    value={form.contentHtml}
                    onChange={(html) => set("contentHtml", html)}
                    placeholder="Write the article — use the toolbar for headings, lists, tables, quotes, images and video."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="extras" className="mt-4 space-y-6">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Key takeaways</CardTitle>
                  <CardDescription>
                    Shown in a highlighted box above the article body.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {form.keyTakeaways.map((takeaway, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Textarea
                        rows={2}
                        value={takeaway}
                        onChange={(event) =>
                          set(
                            "keyTakeaways",
                            form.keyTakeaways.map((current, i) =>
                              i === index ? event.target.value : current,
                            ),
                          )
                        }
                      />
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="text-destructive"
                        aria-label="Remove takeaway"
                        onClick={() =>
                          set(
                            "keyTakeaways",
                            form.keyTakeaways.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => set("keyTakeaways", [...form.keyTakeaways, ""])}
                  >
                    <Plus className="size-3.5" />
                    Add takeaway
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>FAQs</CardTitle>
                  <CardDescription>
                    Rendered as an accordion and emitted as FAQPage structured data, which can earn
                    an expanded result in search.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.faqs.map((faq, index) => (
                    <div key={index} className="space-y-2 rounded-xl border border-border/70 p-3">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Question"
                          value={faq.question}
                          onChange={(event) =>
                            set(
                              "faqs",
                              form.faqs.map((current, i) =>
                                i === index ? { ...current, question: event.target.value } : current,
                              ),
                            )
                          }
                        />
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          className="text-destructive"
                          aria-label="Remove FAQ"
                          onClick={() => set("faqs", form.faqs.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                      <Textarea
                        rows={3}
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(event) =>
                          set(
                            "faqs",
                            form.faqs.map((current, i) =>
                              i === index ? { ...current, answer: event.target.value } : current,
                            ),
                          )
                        }
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => set("faqs", [...form.faqs, { question: "", answer: "" }])}
                  >
                    <Plus className="size-3.5" />
                    Add FAQ
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Sources & references</CardTitle>
                  <CardDescription>
                    Citations listed at the end of the article. Rendered with{" "}
                    <code>rel=&quot;nofollow&quot;</code>.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {form.sources.map((source, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Label"
                        value={source.label}
                        onChange={(event) =>
                          set(
                            "sources",
                            form.sources.map((current, i) =>
                              i === index ? { ...current, label: event.target.value } : current,
                            ),
                          )
                        }
                      />
                      <Input
                        placeholder="https://…"
                        value={source.url}
                        onChange={(event) =>
                          set(
                            "sources",
                            form.sources.map((current, i) =>
                              i === index ? { ...current, url: event.target.value } : current,
                            ),
                          )
                        }
                      />
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="text-destructive"
                        aria-label="Remove source"
                        onClick={() => set("sources", form.sources.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => set("sources", [...form.sources, { label: "", url: "" }])}
                  >
                    <Plus className="size-3.5" />
                    Add source
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="taxonomy" className="mt-4">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Format, topic, author & tags</CardTitle>
                  <CardDescription>
                    The format pill and topic drive the archive filters; tags power the related
                    articles rail.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Format</Label>
                      <Select
                        value={form.contentType}
                        onValueChange={(value) =>
                          value && set("contentType", value as BlogContentType)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BLOG_CONTENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {BLOG_CONTENT_TYPE_META[type].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {BLOG_CONTENT_TYPE_META[form.contentType].description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Topic</Label>
                      <Select
                        value={form.categoryId || NONE}
                        onValueChange={(value) => set("categoryId", value === NONE ? "" : (value ?? ""))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Uncategorised" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE}>Uncategorised</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Author</Label>
                      <Select
                        value={form.authorId || NONE}
                        onValueChange={(value) => set("authorId", value === NONE ? "" : (value ?? ""))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="No byline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE}>No byline</SelectItem>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    {tags.length ? (
                      <div className="flex flex-wrap gap-2 rounded-xl border border-border/70 p-3">
                        {tags.map((tag) => {
                          const selected = form.tagIds.includes(tag.id);
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              aria-pressed={selected}
                              onClick={() =>
                                set(
                                  "tagIds",
                                  selected
                                    ? form.tagIds.filter((id) => id !== tag.id)
                                    : [...form.tagIds, tag.id],
                                )
                              }
                              className={cn(
                                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                                selected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border text-muted-foreground hover:border-primary",
                              )}
                            >
                              {tag.name}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No tags yet — create them under Blog → Tags.
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {form.tagIds.length} selected
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="mt-4">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Search & social</CardTitle>
                  <CardDescription>
                    Leave blank to fall back to the title, excerpt and cover image.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>SEO title</Label>
                      <Input
                        value={form.seoTitle}
                        onChange={(event) => set("seoTitle", event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        {form.seoTitle.length || form.title.length}/60 recommended
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Canonical URL</Label>
                      <Input
                        value={form.canonicalUrl}
                        placeholder="Only if this article is republished from elsewhere"
                        onChange={(event) => set("canonicalUrl", event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Meta description</Label>
                    <Textarea
                      rows={3}
                      value={form.seoDescription}
                      onChange={(event) => set("seoDescription", event.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {form.seoDescription.length || form.excerpt.length}/160 recommended
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Keywords</Label>
                    <Input
                      value={form.seoKeywords}
                      placeholder="comma, separated, keywords"
                      onChange={(event) => set("seoKeywords", event.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <ImageField
                      label="Open Graph image"
                      value={form.ogImageUrl}
                      onChange={(value) => set("ogImageUrl", value)}
                    />
                    <ImageField
                      label="Twitter image"
                      value={form.twitterImageUrl}
                      onChange={(value) => set("twitterImageUrl", value)}
                    />
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                    <Switch
                      checked={form.noIndex}
                      onCheckedChange={(noIndex) => set("noIndex", noIndex)}
                    />
                    <div>
                      <Label>NoIndex</Label>
                      <p className="text-xs text-muted-foreground">
                        Keeps this article out of search engines and the sitemap.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="publish" className="mt-4">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                  <CardDescription>
                    Only PUBLISHED, visible, active posts with a past publish date appear on the
                    site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={form.status}
                        onValueChange={(value) => value && set("status", value as BlogPostStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BLOG_POST_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Publish date & time</Label>
                      <Input
                        type="datetime-local"
                        value={form.publishedAt}
                        onChange={(event) => set("publishedAt", event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        A future date with status Scheduled keeps the post hidden until then.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <ToggleRow
                      label="Visible"
                      hint="Hidden posts stay in the CMS but leave the site."
                      checked={form.isVisible}
                      onChange={(value) => set("isVisible", value)}
                    />
                    <ToggleRow
                      label="Active"
                      hint="Deactivate to retire without deleting."
                      checked={form.isActive}
                      onChange={(value) => set("isActive", value)}
                    />
                    <ToggleRow
                      label="Featured"
                      hint="Eligible for the wide lead card on /blog."
                      checked={form.isFeatured}
                      onChange={(value) => set("isFeatured", value)}
                    />
                    <ToggleRow
                      label="Pinned"
                      hint="Floats to the top of every listing."
                      checked={form.isPinned}
                      onChange={(value) => set("isPinned", value)}
                    />
                    <ToggleRow
                      label="Allow comments"
                      hint="Turns the comment form on for this article."
                      checked={form.allowComments}
                      onChange={(value) => set("allowComments", value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="sticky bottom-0 -mx-4 flex justify-end gap-3 border-t bg-background/90 px-4 py-4 backdrop-blur-xl md:-mx-6 md:px-6">
            <Button
              type="button"
              variant="outline"
              nativeButton={false}
              render={<Link href="/admin/blog" />}
            >
              Cancel
            </Button>
            <SaveButton loading={saving} label={postId ? "Save changes" : "Create post"} />
          </div>
        </form>
      </main>
    </>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
      <Switch checked={checked} onCheckedChange={onChange} />
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}
