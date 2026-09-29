"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  MessageSquare,
  MoreHorizontal,
  Pin,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { HeroAlignment, HeroHeight } from "@/lib/cms/blog-types";
import {
  BLOG_CONTENT_TYPE_META,
  type BlogAuthorItem,
  type BlogCategoryItem,
  type BlogCommentItem,
  type BlogPostItem,
  type BlogTagItem,
} from "@/lib/cms/types";

type SectionForm = {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  taglineBg: string;
  homeLimit: number;
  homeCtaText: string;
  homeCtaHref: string;
  showHomeCta: boolean;
  isVisible: boolean;
  archiveTagline: string;
  archiveTitleLine1: string;
  archiveTitleLine2: string;
  archiveIntro: string;
  archiveHeroImage: string;
  archiveHeroOverlay: number;
  archiveHeroHeight: HeroHeight;
  archiveHeroAlign: HeroAlignment;
  archiveShowCrumbs: boolean;
  postsPerPage: number;
  showSidebar: boolean;
  showSearch: boolean;
  showCategories: boolean;
  showTags: boolean;
  allowComments: boolean;
  moderateComments: boolean;
  disclaimer: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  twitterImageUrl: string;
  noIndex: boolean;
};

type AdminUser = { name: string; email: string; role: "ADMIN" | "MANAGER" };

function BannerPreview({ section }: { section: SectionForm }) {
  const padding =
    section.archiveHeroHeight === "tall"
      ? "py-16"
      : section.archiveHeroHeight === "compact"
        ? "py-8"
        : "py-12";

  return (
    <div className="relative overflow-hidden rounded-xl border">
      {section.archiveHeroImage ? (
        <Image
          src={section.archiveHeroImage}
          alt=""
          fill
          unoptimized
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}
      <div
        className="absolute inset-0 bg-[var(--findox-black4)]"
        style={{ opacity: section.archiveHeroOverlay / 100 }}
      />
      <div
        className={`relative px-6 ${padding} ${
          section.archiveHeroAlign === "center" ? "text-center" : "text-left"
        }`}
      >
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--findox-primary)] uppercase">
          {section.archiveTagline}
        </p>
        <p className="mt-3 text-2xl leading-tight font-bold text-white">
          {section.archiveTitleLine1}
          <br />
          {section.archiveTitleLine2}
        </p>
        <p
          className={`mt-3 line-clamp-2 max-w-lg text-sm text-white/75 ${
            section.archiveHeroAlign === "center" ? "mx-auto" : ""
          }`}
        >
          {section.archiveIntro}
        </p>
        {section.archiveShowCrumbs ? (
          <p
            className={`mt-4 text-xs text-white/70 ${
              section.archiveHeroAlign === "center" ? "text-center" : "text-left"
            }`}
          >
            Home / <span className="text-[var(--findox-primary)]">Blog</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function BlogPageClient({ user }: { user: AdminUser }) {
  const [section, setSection] = useState<SectionForm | null>(null);
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [tags, setTags] = useState<BlogTagItem[]>([]);
  const [authors, setAuthors] = useState<BlogAuthorItem[]>([]);
  const [comments, setComments] = useState<BlogCommentItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [busy, setBusy] = useState(false);
  const [trash, setTrash] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [commentFilter, setCommentFilter] = useState("PENDING");

  const loadPosts = useCallback(async (trashMode: boolean) => {
    const response = await fetch(`/api/admin/blog/posts?trash=${trashMode}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Failed to load posts");
    setPosts(data.posts ?? []);
    setSelected(new Set());
  }, []);

  const loadComments = useCallback(async (filter: string) => {
    const query = filter === "ALL" ? "" : `?status=${filter}`;
    const response = await fetch(`/api/admin/blog/comments${query}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Failed to load comments");
    setComments(data.comments ?? []);
    setPendingCount(data.pendingCount ?? 0);
  }, []);

  const loadTaxonomy = useCallback(async () => {
    const [categoriesRes, tagsRes, authorsRes] = await Promise.all([
      fetch("/api/admin/blog/categories"),
      fetch("/api/admin/blog/tags"),
      fetch("/api/admin/blog/authors"),
    ]);
    const [categoriesData, tagsData, authorsData] = await Promise.all([
      categoriesRes.json(),
      tagsRes.json(),
      authorsRes.json(),
    ]);
    setCategories(categoriesData.categories ?? []);
    setTags(tagsData.tags ?? []);
    setAuthors(authorsData.authors ?? []);
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const sectionRes = await fetch("/api/admin/blog/section");
        const sectionData = await sectionRes.json();
        if (!active) return;

        setSection({
          ...sectionData.section,
          seoTitle: sectionData.section.seoTitle ?? "",
          seoDescription: sectionData.section.seoDescription ?? "",
          seoKeywords: sectionData.section.seoKeywords ?? "",
          canonicalUrl: sectionData.section.canonicalUrl ?? "",
          ogImageUrl: sectionData.section.ogImageUrl ?? "",
          twitterImageUrl: sectionData.section.twitterImageUrl ?? "",
        });

        await Promise.all([loadPosts(false), loadTaxonomy(), loadComments("PENDING")]);
      } catch (error) {
        if (active) toast.error(error instanceof Error ? error.message : "Failed to load blog");
      } finally {
        if (active) setLoading(false);
      }
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, [loadPosts, loadTaxonomy, loadComments]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return posts.filter((post) => {
      if (query) {
        const haystack = [post.title, post.excerpt, post.slug, post.category?.name, post.author?.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (status !== "all" && post.status !== status) return false;
      return true;
    });
  }, [posts, search, status]);

  async function saveSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!section) return;
    setSavingSection(true);
    try {
      const response = await fetch("/api/admin/blog/section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...section,
          homeLimit: Number(section.homeLimit),
          postsPerPage: Number(section.postsPerPage),
          seoTitle: section.seoTitle || null,
          seoDescription: section.seoDescription || null,
          seoKeywords: section.seoKeywords || null,
          canonicalUrl: section.canonicalUrl || null,
          ogImageUrl: section.ogImageUrl || null,
          twitterImageUrl: section.twitterImageUrl || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      toast.success("Blog settings updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingSection(false);
    }
  }

  async function run(action: () => Promise<void>, successMessage: string) {
    setBusy(true);
    try {
      await action();
      toast.success(successMessage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  async function runBulk(action: string) {
    if (!selected.size) {
      toast.error("Select at least one post");
      return;
    }
    await run(async () => {
      const response = await fetch("/api/admin/blog/posts/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Bulk action failed");
      await loadPosts(trash);
    }, "Bulk action completed");
  }

  async function postAction(path: string, method: string, successMessage: string) {
    await run(async () => {
      const response = await fetch(path, { method });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Action failed");
      await loadPosts(trash);
    }, successMessage);
  }

  async function moderate(ids: string[], action: string) {
    await run(async () => {
      const response = await fetch("/api/admin/blog/comments/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Moderation failed");
      await loadComments(commentFilter);
    }, "Comment updated");
  }

  function toggleSelected(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Blog"
        description="Posts, topics, tags, authors and comment moderation."
      />

      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Tabs defaultValue="posts">
          <TabsList className="flex-wrap">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="categories">Topics</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="comments">
              Comments
              {pendingCount > 0 ? (
                <Badge variant="destructive" className="ml-2">
                  {pendingCount}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4">
            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Posts</CardTitle>
                  <CardDescription>
                    Search, filter, publish, duplicate and trash blog articles.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {posts.filter((post) => post.status === "PUBLISHED").length} published /{" "}
                    {filteredPosts.length} shown
                  </Badge>
                  <Button
                    type="button"
                    variant={trash ? "default" : "outline"}
                    onClick={() => {
                      const next = !trash;
                      setTrash(next);
                      void run(() => loadPosts(next), next ? "Showing trash" : "Showing posts");
                    }}
                  >
                    <Trash2 className="size-4" />
                    {trash ? "Viewing trash" : "Trash"}
                  </Button>
                  <Button nativeButton={false} render={<Link href="/admin/blog/new" />}>
                    <Plus className="size-4" />
                    New post
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search title, excerpt, slug, topic, author…"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </div>
                  <Select value={status} onValueChange={(value) => value && setStatus(value)}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selected.size > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-muted/30 p-3">
                    <span className="text-sm font-medium">{selected.size} selected</span>
                    {!trash ? (
                      <>
                        {["publish", "draft", "archive", "feature", "pin", "duplicate"].map((action) => (
                          <Button
                            key={action}
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => void runBulk(action)}
                            className="capitalize"
                          >
                            {action}
                          </Button>
                        ))}
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={busy}
                          onClick={() => void runBulk("soft-delete")}
                        >
                          Move to trash
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => void runBulk("restore")}
                        >
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={busy}
                          onClick={() => void runBulk("hard-delete")}
                        >
                          Delete forever
                        </Button>
                      </>
                    )}
                  </div>
                ) : null}

                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">
                            <input
                              type="checkbox"
                              aria-label="Select all"
                              checked={
                                filteredPosts.length > 0 && selected.size === filteredPosts.length
                              }
                              onChange={() =>
                                setSelected(
                                  selected.size === filteredPosts.length
                                    ? new Set()
                                    : new Set(filteredPosts.map((post) => post.id)),
                                )
                              }
                            />
                          </TableHead>
                          <TableHead>Post</TableHead>
                          <TableHead>Format</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Comments</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                aria-label={`Select ${post.title}`}
                                checked={selected.has(post.id)}
                                onChange={() => toggleSelected(post.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
                                  {post.coverImageUrl ? (
                                    <Image
                                      src={post.thumbnailUrl || post.coverImageUrl}
                                      alt={post.coverImageAlt || post.title}
                                      fill
                                      className="object-cover"
                                      sizes="48px"
                                      unoptimized
                                    />
                                  ) : null}
                                </div>
                                <div className="min-w-0 max-w-[380px]">
                                  <p className="truncate font-medium">
                                    {post.isPinned ? (
                                      <Pin className="mr-1 inline size-3 text-accent dark:text-primary" />
                                    ) : null}
                                    {post.isFeatured ? (
                                      <Star className="mr-1 inline size-3 text-accent dark:text-primary" />
                                    ) : null}
                                    {post.title}
                                  </p>
                                  <p className="truncate text-xs text-muted-foreground">
                                    /{post.slug} · {post.category?.name ?? "Uncategorised"} ·{" "}
                                    {post.author?.name ?? "No byline"} · {post.readingMinutes} min
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {BLOG_CONTENT_TYPE_META[post.contentType].label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                <Badge
                                  variant={post.status === "PUBLISHED" ? "default" : "secondary"}
                                >
                                  {post.status}
                                </Badge>
                                {!post.isVisible ? (
                                  <Badge variant="secondary">Hidden</Badge>
                                ) : null}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MessageSquare className="size-3.5" />
                                {post.commentCount}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-full outline-none hover:bg-muted">
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Row actions</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!trash ? (
                                    <>
                                      <DropdownMenuItem
                                        render={<Link href={`/admin/blog/${post.id}`} />}
                                      >
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        render={<Link href={`/blog/${post.slug}`} target="_blank" />}
                                      >
                                        View on site
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          void postAction(
                                            `/api/admin/blog/posts/${post.id}/duplicate`,
                                            "POST",
                                            "Post duplicated",
                                          )
                                        }
                                      >
                                        <Copy className="size-4" />
                                        Duplicate
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() =>
                                          void postAction(
                                            `/api/admin/blog/posts/${post.id}`,
                                            "DELETE",
                                            "Moved to trash",
                                          )
                                        }
                                      >
                                        <Trash2 className="size-4" />
                                        Move to trash
                                      </DropdownMenuItem>
                                    </>
                                  ) : (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          void postAction(
                                            `/api/admin/blog/posts/${post.id}/restore`,
                                            "POST",
                                            "Post restored as draft",
                                          )
                                        }
                                      >
                                        <RotateCcw className="size-4" />
                                        Restore
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          void postAction(
                                            `/api/admin/blog/posts/${post.id}?hard=true`,
                                            "DELETE",
                                            "Permanently deleted",
                                          )
                                        }
                                      >
                                        <Trash2 className="size-4" />
                                        Delete forever
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                        {!filteredPosts.length ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                              {trash ? "Trash is empty." : "No posts found. Write your first article."}
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <TaxonomyPanel
              kind="category"
              items={categories}
              busy={busy}
              onReload={loadTaxonomy}
            />
          </TabsContent>

          <TabsContent value="tags" className="mt-4">
            <TaxonomyPanel kind="tag" items={tags} busy={busy} onReload={loadTaxonomy} />
          </TabsContent>

          <TabsContent value="authors" className="mt-4">
            <AuthorsPanel authors={authors} onReload={loadTaxonomy} />
          </TabsContent>

          <TabsContent value="comments" className="mt-4">
            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Comment moderation</CardTitle>
                  <CardDescription>
                    Approve, reject or mark as spam. Pending comments never appear on the site.
                  </CardDescription>
                </div>
                <Select
                  value={commentFilter}
                  onValueChange={(value) => {
                    if (!value) return;
                    setCommentFilter(value);
                    void run(() => loadComments(value), "Filter applied");
                  }}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="SPAM">Spam</SelectItem>
                    <SelectItem value="ALL">All</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>

              <CardContent className="space-y-3">
                {!comments.length ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No comments in this queue.
                  </p>
                ) : null}

                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-xl border border-border/70 p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-medium">{comment.name}</span>
                      <span className="text-xs text-muted-foreground">{comment.email}</span>
                      <Badge variant={comment.status === "APPROVED" ? "default" : "secondary"}>
                        {comment.status}
                      </Badge>
                      {comment.parentId ? <Badge variant="outline">Reply</Badge> : null}
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {comment.postTitle ? (
                      <p className="mb-2 text-xs text-muted-foreground">
                        on{" "}
                        <Link
                          href={`/blog/${comment.postSlug}#comments`}
                          target="_blank"
                          className="underline"
                        >
                          {comment.postTitle}
                        </Link>
                      </p>
                    ) : null}

                    <p className="mb-3 text-sm whitespace-pre-line text-muted-foreground">
                      {comment.body}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {comment.status !== "APPROVED" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => void moderate([comment.id], "approve")}
                        >
                          Approve
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => void moderate([comment.id], "reject")}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => void moderate([comment.id], "spam")}
                      >
                        Spam
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() =>
                          void moderate([comment.id], comment.isPinned ? "unpin" : "pin")
                        }
                      >
                        {comment.isPinned ? "Unpin" : "Pin"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busy}
                        onClick={() => void moderate([comment.id], "delete")}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Blog settings</CardTitle>
                <CardDescription>
                  Homepage band, archive page, comment policy and blog-wide SEO.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!section || loading ? (
                  <div className="h-48 animate-pulse rounded-xl bg-muted" />
                ) : (
                  <form onSubmit={saveSection} className="space-y-6">
                    <Tabs defaultValue="home">
                      <TabsList>
                        <TabsTrigger value="home">Homepage</TabsTrigger>
                        <TabsTrigger value="hero">Hero banner</TabsTrigger>
                        <TabsTrigger value="archive">Archive page</TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                      </TabsList>

                      <TabsContent value="home" className="mt-4 space-y-4">
                        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                          <Switch
                            checked={section.isVisible}
                            onCheckedChange={(isVisible) => setSection({ ...section, isVisible })}
                          />
                          <div>
                            <Label>Section visible</Label>
                            <p className="text-xs text-muted-foreground">
                              Hides the &quot;Our Latest Blog&quot; band on the homepage.
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Section badge</Label>
                            <Input
                              value={section.tagline}
                              onChange={(event) =>
                                setSection({ ...section, tagline: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Badge background</Label>
                            <Input
                              value={section.taglineBg}
                              onChange={(event) =>
                                setSection({ ...section, taglineBg: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Title line 1</Label>
                            <Input
                              value={section.titleLine1}
                              onChange={(event) =>
                                setSection({ ...section, titleLine1: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Title line 2</Label>
                            <Input
                              value={section.titleLine2}
                              onChange={(event) =>
                                setSection({ ...section, titleLine2: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Posts to show</Label>
                            <Input
                              type="number"
                              min={1}
                              max={12}
                              value={section.homeLimit}
                              onChange={(event) =>
                                setSection({ ...section, homeLimit: Number(event.target.value) })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Button label</Label>
                            <Input
                              value={section.homeCtaText}
                              onChange={(event) =>
                                setSection({ ...section, homeCtaText: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Button link</Label>
                            <Input
                              value={section.homeCtaHref}
                              onChange={(event) =>
                                setSection({ ...section, homeCtaHref: event.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                          <Switch
                            checked={section.showHomeCta}
                            onCheckedChange={(showHomeCta) => setSection({ ...section, showHomeCta })}
                          />
                          <div>
                            <Label>Show &quot;view all&quot; button</Label>
                            <p className="text-xs text-muted-foreground">
                              The only link from the homepage band to the full blog.
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="hero" className="mt-4 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Banner eyebrow</Label>
                            <Input
                              value={section.archiveTagline}
                              onChange={(event) =>
                                setSection({ ...section, archiveTagline: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Banner title line 1</Label>
                            <Input
                              value={section.archiveTitleLine1}
                              onChange={(event) =>
                                setSection({ ...section, archiveTitleLine1: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Banner title line 2</Label>
                            <Input
                              value={section.archiveTitleLine2}
                              onChange={(event) =>
                                setSection({ ...section, archiveTitleLine2: event.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Banner intro</Label>
                          <Textarea
                            rows={3}
                            value={section.archiveIntro}
                            onChange={(event) =>
                              setSection({ ...section, archiveIntro: event.target.value })
                            }
                          />
                        </div>

                        <ImageField
                          label="Banner background image"
                          value={section.archiveHeroImage}
                          onChange={(value) => setSection({ ...section, archiveHeroImage: value })}
                        />

                        <div className="grid gap-5 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label>Banner height</Label>
                            <Select
                              value={section.archiveHeroHeight}
                              onValueChange={(value) =>
                                setSection({ ...section, archiveHeroHeight: value as HeroHeight })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="compact">Compact</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="tall">Tall</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Text alignment</Label>
                            <Select
                              value={section.archiveHeroAlign}
                              onValueChange={(value) =>
                                setSection({
                                  ...section,
                                  archiveHeroAlign: value as HeroAlignment,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="center">Centered</SelectItem>
                                <SelectItem value="left">Left aligned</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label>Image darkening</Label>
                              <span className="text-sm font-medium text-muted-foreground">
                                {section.archiveHeroOverlay}%
                              </span>
                            </div>
                            <Slider
                              min={0}
                              max={95}
                              step={1}
                              value={section.archiveHeroOverlay}
                              onValueChange={(value) =>
                                setSection({
                                  ...section,
                                  archiveHeroOverlay: Array.isArray(value) ? value[0] : value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                          <Switch
                            checked={section.archiveShowCrumbs}
                            onCheckedChange={(archiveShowCrumbs) =>
                              setSection({ ...section, archiveShowCrumbs })
                            }
                          />
                          <div>
                            <Label>Show breadcrumbs</Label>
                            <p className="text-xs text-muted-foreground">
                              The Home / Blog trail under the banner title.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Preview</Label>
                          <BannerPreview section={section} />
                        </div>
                      </TabsContent>

                      <TabsContent value="archive" className="mt-4 space-y-4">
                        <div className="space-y-2 md:max-w-60">
                          <Label>Posts per page</Label>
                          <Input
                            type="number"
                            min={3}
                            max={48}
                            value={section.postsPerPage}
                            onChange={(event) =>
                              setSection({ ...section, postsPerPage: Number(event.target.value) })
                            }
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {(
                            [
                              ["showSidebar", "Show sidebar"],
                              ["showSearch", "Show search bar"],
                              ["showCategories", "Show topic filters"],
                              ["showTags", "Show tag cloud"],
                            ] as const
                          ).map(([key, label]) => (
                            <div
                              key={key}
                              className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3"
                            >
                              <Switch
                                checked={section[key]}
                                onCheckedChange={(value) => setSection({ ...section, [key]: value })}
                              />
                              <Label>{label}</Label>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="comments" className="mt-4 space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                            <Switch
                              checked={section.allowComments}
                              onCheckedChange={(allowComments) =>
                                setSection({ ...section, allowComments })
                              }
                            />
                            <div>
                              <Label>Allow comments</Label>
                              <p className="text-xs text-muted-foreground">
                                Master switch across the whole blog.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                            <Switch
                              checked={section.moderateComments}
                              onCheckedChange={(moderateComments) =>
                                setSection({ ...section, moderateComments })
                              }
                            />
                            <div>
                              <Label>Moderate before publishing</Label>
                              <p className="text-xs text-muted-foreground">
                                Strongly recommended — off means comments go live instantly.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Article disclaimer</Label>
                          <Textarea
                            rows={3}
                            value={section.disclaimer}
                            onChange={(event) =>
                              setSection({ ...section, disclaimer: event.target.value })
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Shown at the foot of every article. Leave blank to hide it.
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="seo" className="mt-4 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>SEO title</Label>
                            <Input
                              value={section.seoTitle}
                              onChange={(event) =>
                                setSection({ ...section, seoTitle: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Canonical URL</Label>
                            <Input
                              value={section.canonicalUrl}
                              onChange={(event) =>
                                setSection({ ...section, canonicalUrl: event.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Meta description</Label>
                          <Textarea
                            rows={3}
                            value={section.seoDescription}
                            onChange={(event) =>
                              setSection({ ...section, seoDescription: event.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Keywords</Label>
                          <Input
                            value={section.seoKeywords}
                            onChange={(event) =>
                              setSection({ ...section, seoKeywords: event.target.value })
                            }
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <ImageField
                            label="Open Graph image"
                            value={section.ogImageUrl}
                            onChange={(value) => setSection({ ...section, ogImageUrl: value })}
                          />
                          <ImageField
                            label="Twitter image"
                            value={section.twitterImageUrl}
                            onChange={(value) => setSection({ ...section, twitterImageUrl: value })}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={section.noIndex}
                            onCheckedChange={(noIndex) => setSection({ ...section, noIndex })}
                          />
                          <Label>NoIndex the blog archive</Label>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-end">
                      <SaveButton loading={savingSection} />
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}


function TaxonomyPanel({
  kind,
  items,
  busy,
  onReload,
}: {
  kind: "category" | "tag";
  items: Array<BlogCategoryItem | BlogTagItem>;
  busy: boolean;
  onReload: () => Promise<void>;
}) {
  const isCategory = kind === "category";
  const endpoint = isCategory ? "/api/admin/blog/categories" : "/api/admin/blog/tags";
  const label = isCategory ? "Topic" : "Tag";

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("icon-folder");
  const [accentColor, setAccentColor] = useState("#5c6b45");
  const [saving, setSaving] = useState(false);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isCategory
            ? {
                name,
                slug,
                description,
                icon,
                accentColor,
                isFeatured: false,
                isVisible: true,
                isActive: true,
                noIndex: false,
              }
            : { name, slug, description, isVisible: true, isActive: true },
        ),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Create failed");
      toast.success(`${label} created`);
      setName("");
      setSlug("");
      setDescription("");
      await onReload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string, postCount: number) {
    if (isCategory && postCount > 0) {
      toast.error(`${postCount} post(s) use this topic — they will become uncategorised.`);
    }
    try {
      const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Delete failed");
      toast.success(`${label} deleted`);
      await onReload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{isCategory ? "Topics" : "Tags"}</CardTitle>
          <CardDescription>
            {isCategory
              ? "Each post belongs to one topic. Topics get their own archive page and appear in the filters."
              : "Tags are cross-cutting labels. A post can carry any number, and they power the related-articles rail."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        {isCategory ? (
                          <i
                            className={(item as BlogCategoryItem).icon}
                            style={{ color: (item as BlogCategoryItem).accentColor }}
                            aria-hidden="true"
                          />
                        ) : null}
                        {item.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">/{item.slug}</TableCell>
                    <TableCell>{item.postCount ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          nativeButton={false}
                          render={
                            <Link
                              href={
                                isCategory
                                  ? `/blog/category/${item.slug}`
                                  : `/blog/tag/${item.slug}`
                              }
                              target="_blank"
                            />
                          }
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={busy}
                          onClick={() => void remove(item.id, item.postCount ?? 0)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!items.length ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                      Nothing here yet.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>New {label.toLowerCase()}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={create} className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input required value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={slug}
                placeholder="auto-generated"
                onChange={(event) => setSlug(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            {isCategory ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Icon class</Label>
                  <Input value={icon} onChange={(event) => setIcon(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Accent colour</Label>
                  <Input
                    value={accentColor}
                    onChange={(event) => setAccentColor(event.target.value)}
                  />
                </div>
              </div>
            ) : null}
            <SaveButton loading={saving} label={`Create ${label.toLowerCase()}`} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AuthorsPanel({
  authors,
  onReload,
}: {
  authors: BlogAuthorItem[];
  onReload: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    role: "",
    credentials: "",
    bio: "",
    avatarUrl: "",
    linkedinUrl: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/blog/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          email: form.email || null,
          linkedinUrl: form.linkedinUrl || null,
          isVisible: true,
          isActive: true,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Create failed");
      toast.success("Author created");
      setForm({
        name: "",
        slug: "",
        role: "",
        credentials: "",
        bio: "",
        avatarUrl: "",
        linkedinUrl: "",
        email: "",
      });
      await onReload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      const response = await fetch(`/api/admin/blog/authors/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Delete failed");
      toast.success("Author archived");
      await onReload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Authors</CardTitle>
          <CardDescription>
            Bylines with role and qualification. Search engines weigh author expertise heavily on
            financial content, so fill the credentials and bio in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {authors.map((author) => (
            <div
              key={author.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border/70 p-4"
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full border bg-muted">
                {author.avatarUrl ? (
                  <Image
                    src={author.avatarUrl}
                    alt={author.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{author.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {[author.role, author.credentials].filter(Boolean).join(" · ")} ·{" "}
                  {author.postCount ?? 0} post(s)
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={`/blog/author/${author.slug}`} target="_blank" />}
                >
                  View
                </Button>
                <Button size="sm" variant="destructive" onClick={() => void remove(author.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {!authors.length ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No authors yet.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>New author</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={create} className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={form.role}
                  placeholder="Partner — Direct Tax"
                  onChange={(event) => setForm({ ...form, role: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Credentials</Label>
                <Input
                  value={form.credentials}
                  placeholder="FCA, DISA (ICAI)"
                  onChange={(event) => setForm({ ...form, credentials: event.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                rows={4}
                value={form.bio}
                onChange={(event) => setForm({ ...form, bio: event.target.value })}
              />
            </div>
            <ImageField
              label="Avatar"
              value={form.avatarUrl}
              onChange={(value) => setForm({ ...form, avatarUrl: value })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input
                  value={form.linkedinUrl}
                  onChange={(event) => setForm({ ...form, linkedinUrl: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </div>
            </div>
            <SaveButton loading={saving} label="Create author" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
