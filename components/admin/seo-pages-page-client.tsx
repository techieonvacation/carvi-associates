"use client";

import { useMemo, useState } from "react";
import {
  Copy,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { SerpPreview } from "@/components/admin/seo/serp-preview";
import { StringListField } from "@/components/admin/seo/string-list-field";
import { PairListField } from "@/components/admin/seo/pair-list-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useSeoCollection } from "@/hooks/use-seo-collection";
import {
  SEO_CHANGE_FREQUENCIES,
  SEO_IMAGE_PREVIEWS,
  SEO_TWITTER_CARDS,
  type SeoPageContent,
} from "@/lib/seo/types";

type AdminUser = { name: string; email: string; role: "ADMIN" | "MANAGER" };

type PageForm = {
  path: string;
  label: string;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  ogImageAlt: string;
  ogType: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageUrl: string;
  twitterCard: string;
  noIndex: boolean;
  noFollow: boolean;
  noArchive: boolean;
  noSnippet: boolean;
  noImageIndex: boolean;
  maxSnippet: string;
  maxImagePreview: string;
  maxVideoPreview: string;
  breadcrumbLabel: string;
  focusKeyword: string;
  secondaryKeywords: string;
  aiSummary: string;
  speakableSelectors: string[];
  hreflangEntries: Array<{ hreflang: string; href: string }>;
  customJsonLd: string;
  includeInSitemap: boolean;
  sitemapPriority: string;
  sitemapChangeFreq: string;
  notes: string;
  isActive: boolean;
};

const emptyForm: PageForm = {
  path: "/",
  label: "",
  title: "",
  description: "",
  keywords: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  ogImageAlt: "",
  ogType: "",
  twitterTitle: "",
  twitterDescription: "",
  twitterImageUrl: "",
  twitterCard: "inherit",
  noIndex: false,
  noFollow: false,
  noArchive: false,
  noSnippet: false,
  noImageIndex: false,
  maxSnippet: "",
  maxImagePreview: "inherit",
  maxVideoPreview: "",
  breadcrumbLabel: "",
  focusKeyword: "",
  secondaryKeywords: "",
  aiSummary: "",
  speakableSelectors: [],
  hreflangEntries: [],
  customJsonLd: "",
  includeInSitemap: true,
  sitemapPriority: "",
  sitemapChangeFreq: "inherit",
  notes: "",
  isActive: true,
};

function toForm(page: SeoPageContent): PageForm {
  return {
    path: page.path,
    label: page.label,
    title: page.title ?? "",
    description: page.description ?? "",
    keywords: page.keywords ?? "",
    canonicalUrl: page.canonicalUrl ?? "",
    ogTitle: page.ogTitle ?? "",
    ogDescription: page.ogDescription ?? "",
    ogImageUrl: page.ogImageUrl ?? "",
    ogImageAlt: page.ogImageAlt ?? "",
    ogType: page.ogType ?? "",
    twitterTitle: page.twitterTitle ?? "",
    twitterDescription: page.twitterDescription ?? "",
    twitterImageUrl: page.twitterImageUrl ?? "",
    twitterCard: page.twitterCard ?? "inherit",
    noIndex: page.noIndex,
    noFollow: page.noFollow,
    noArchive: page.noArchive,
    noSnippet: page.noSnippet,
    noImageIndex: page.noImageIndex,
    maxSnippet: page.maxSnippet === null ? "" : String(page.maxSnippet),
    maxImagePreview: page.maxImagePreview ?? "inherit",
    maxVideoPreview: page.maxVideoPreview === null ? "" : String(page.maxVideoPreview),
    breadcrumbLabel: page.breadcrumbLabel ?? "",
    focusKeyword: page.focusKeyword,
    secondaryKeywords: page.secondaryKeywords,
    aiSummary: page.aiSummary,
    speakableSelectors: page.speakableSelectors,
    hreflangEntries: page.hreflangEntries,
    customJsonLd: page.customJsonLd ? JSON.stringify(page.customJsonLd, null, 2) : "",
    includeInSitemap: page.includeInSitemap,
    sitemapPriority: page.sitemapPriority === null ? "" : String(page.sitemapPriority),
    sitemapChangeFreq: page.sitemapChangeFreq ?? "inherit",
    notes: page.notes,
    isActive: page.isActive,
  };
}

function toPayload(form: PageForm) {
  let customJsonLd: unknown = null;
  if (form.customJsonLd.trim()) {
    customJsonLd = JSON.parse(form.customJsonLd);
  }

  return {
    path: form.path.trim(),
    label: form.label,
    title: form.title,
    description: form.description,
    keywords: form.keywords,
    canonicalUrl: form.canonicalUrl,
    ogTitle: form.ogTitle,
    ogDescription: form.ogDescription,
    ogImageUrl: form.ogImageUrl,
    ogImageAlt: form.ogImageAlt,
    ogType: form.ogType,
    twitterTitle: form.twitterTitle,
    twitterDescription: form.twitterDescription,
    twitterImageUrl: form.twitterImageUrl,
    twitterCard: form.twitterCard === "inherit" ? null : form.twitterCard,
    noIndex: form.noIndex,
    noFollow: form.noFollow,
    noArchive: form.noArchive,
    noSnippet: form.noSnippet,
    noImageIndex: form.noImageIndex,
    maxSnippet: form.maxSnippet === "" ? null : Number(form.maxSnippet),
    maxImagePreview: form.maxImagePreview === "inherit" ? null : form.maxImagePreview,
    maxVideoPreview: form.maxVideoPreview === "" ? null : Number(form.maxVideoPreview),
    breadcrumbLabel: form.breadcrumbLabel,
    focusKeyword: form.focusKeyword,
    secondaryKeywords: form.secondaryKeywords,
    aiSummary: form.aiSummary,
    speakableSelectors: form.speakableSelectors.filter(Boolean),
    hreflangEntries: form.hreflangEntries,
    customJsonLd,
    includeInSitemap: form.includeInSitemap,
    sitemapPriority: form.sitemapPriority === "" ? null : Number(form.sitemapPriority),
    sitemapChangeFreq: form.sitemapChangeFreq === "inherit" ? null : form.sitemapChangeFreq,
    notes: form.notes,
    isActive: form.isActive,
  };
}

export function SeoPagesPageClient({ user, siteUrl }: { user: AdminUser; siteUrl: string }) {
  const collection = useSeoCollection<SeoPageContent, ReturnType<typeof toPayload>>({
    resource: "pages",
    collectionKey: "pages",
    itemKey: "page",
    label: "Route",
  });

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PageForm | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return collection.items;
    return collection.items.filter(
      (page) =>
        page.path.toLowerCase().includes(query) ||
        page.label.toLowerCase().includes(query) ||
        (page.title ?? "").toLowerCase().includes(query),
    );
  }, [collection.items, search]);

  function set<K extends keyof PageForm>(key: K, value: PageForm[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  function startCreate() {
    setEditingId("new");
    setForm({ ...emptyForm });
    setJsonError(null);
  }

  function startEdit(page: SeoPageContent) {
    setEditingId(page.id);
    setForm(toForm(page));
    setJsonError(null);
  }

  function closeEditor() {
    setEditingId(null);
    setForm(null);
    setJsonError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    let payload: ReturnType<typeof toPayload>;
    try {
      payload = toPayload(form);
      setJsonError(null);
    } catch {
      setJsonError("Custom JSON-LD is not valid JSON");
      return;
    }

    const ok =
      editingId === "new"
        ? await collection.create(payload)
        : await collection.update(editingId as string, payload);

    if (ok) closeEditor();
  }

  function toggleSelected(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Page SEO"
        description="Per-route titles, descriptions, canonicals, robots directives and structured data."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Managed routes</CardTitle>
              <CardDescription>
                Any route listed here overrides the global defaults when it is rendered.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search routes"
                  className="w-56 pl-9"
                />
              </div>
              <Button type="button" onClick={startCreate}>
                <Plus className="size-4" />
                New route
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selected.length ? (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                <span className="text-sm font-medium">{selected.length} selected</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void collection.bulk(selected, "activate")}
                >
                  Activate
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void collection.bulk(selected, "deactivate")}
                >
                  Deactivate
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void collection.bulk(selected, "duplicate")}
                >
                  <Copy className="size-4" />
                  Duplicate
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={() => void collection.bulk(selected, "soft-delete").then(() => setSelected([]))}
                >
                  <Trash2 className="size-4" />
                  Move to trash
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setSelected([])}>
                  <X className="size-4" />
                  Clear
                </Button>
              </div>
            ) : null}

            {collection.loading ? (
              <div className="h-64 animate-pulse rounded-xl bg-muted" />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border/70">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10" />
                      <TableHead>Route</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-32">Sitemap</TableHead>
                      <TableHead className="w-32">Indexing</TableHead>
                      <TableHead className="w-32">Status</TableHead>
                      <TableHead className="w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                          No routes configured yet. Add the homepage, blog index and every landing
                          page you want to control.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell>
                            <Checkbox
                              checked={selected.includes(page.id)}
                              onCheckedChange={() => toggleSelected(page.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <button
                              type="button"
                              className="text-left font-medium hover:text-primary"
                              onClick={() => startEdit(page)}
                            >
                              {page.path}
                            </button>
                            {page.label ? (
                              <p className="text-xs text-muted-foreground">{page.label}</p>
                            ) : null}
                          </TableCell>
                          <TableCell className="max-w-[320px]">
                            <p className="truncate text-sm">{page.title || "—"}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {page.description || "Falls back to the site description"}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant={page.includeInSitemap ? "secondary" : "outline"}>
                              {page.includeInSitemap ? "Included" : "Excluded"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={page.noIndex ? "destructive" : "secondary"}>
                              {page.noIndex ? "noindex" : "index"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={page.isActive ? "secondary" : "outline"}>
                              {page.isActive ? "Active" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => void collection.remove(page.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {collection.trashed.length ? (
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Trash</CardTitle>
              <CardDescription>Restore a route or delete it permanently.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {collection.trashed.map((page) => (
                <div
                  key={page.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{page.path}</p>
                    <p className="text-xs text-muted-foreground">{page.title || page.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void collection.bulk([page.id], "restore")}
                    >
                      <RotateCcw className="size-4" />
                      Restore
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      onClick={() => void collection.remove(page.id, true)}
                    >
                      <Trash2 className="size-4" />
                      Delete forever
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {form && editingId ? (
          <Card className="border-primary/40">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{editingId === "new" ? "New route" : `Editing ${form.path}`}</CardTitle>
                <CardDescription>
                  Leave a field blank to inherit the global default for that value.
                </CardDescription>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={closeEditor}>
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basics">
                  <TabsList className="flex h-auto flex-wrap">
                    <TabsTrigger value="basics">Basics</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="robots">Robots</TabsTrigger>
                    <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
                    <TabsTrigger value="aeo">AEO</TabsTrigger>
                    <TabsTrigger value="schema">Structured data</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basics" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Route path</Label>
                        <Input
                          value={form.path}
                          placeholder="/about"
                          onChange={(e) => set("path", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Internal label</Label>
                        <Input
                          value={form.label}
                          placeholder="About page"
                          onChange={(e) => set("label", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Meta description</Label>
                      <Textarea
                        rows={3}
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                      />
                    </div>

                    <SerpPreview
                      url={`${siteUrl.replace(/^https?:\/\//, "")}${form.path}`}
                      title={form.title}
                      description={form.description}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Focus keyword</Label>
                        <Input
                          value={form.focusKeyword}
                          onChange={(e) => set("focusKeyword", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary keywords</Label>
                        <Input
                          value={form.secondaryKeywords}
                          onChange={(e) => set("secondaryKeywords", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Meta keywords override</Label>
                        <Input value={form.keywords} onChange={(e) => set("keywords", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Canonical URL override</Label>
                        <Input
                          value={form.canonicalUrl}
                          onChange={(e) => set("canonicalUrl", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Breadcrumb label</Label>
                        <Input
                          value={form.breadcrumbLabel}
                          onChange={(e) => set("breadcrumbLabel", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch checked={form.isActive} onCheckedChange={(value) => set("isActive", value)} />
                      <Label>Route is active</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Internal notes</Label>
                      <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Open Graph title</Label>
                        <Input value={form.ogTitle} onChange={(e) => set("ogTitle", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Open Graph type</Label>
                        <Input value={form.ogType} onChange={(e) => set("ogType", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Open Graph description</Label>
                      <Textarea
                        rows={2}
                        value={form.ogDescription}
                        onChange={(e) => set("ogDescription", e.target.value)}
                      />
                    </div>
                    <ImageField
                      label="Open Graph image"
                      value={form.ogImageUrl}
                      onChange={(value) => set("ogImageUrl", value)}
                    />
                    <div className="space-y-2">
                      <Label>Open Graph image alt</Label>
                      <Input value={form.ogImageAlt} onChange={(e) => set("ogImageAlt", e.target.value)} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Twitter/X title</Label>
                        <Input
                          value={form.twitterTitle}
                          onChange={(e) => set("twitterTitle", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Twitter/X card</Label>
                        <Select
                          value={form.twitterCard}
                          onValueChange={(value) => value && set("twitterCard", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inherit">Inherit global</SelectItem>
                            {SEO_TWITTER_CARDS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option.toLowerCase().replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Twitter/X description</Label>
                      <Textarea
                        rows={2}
                        value={form.twitterDescription}
                        onChange={(e) => set("twitterDescription", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Twitter/X image</Label>
                      <Input
                        value={form.twitterImageUrl}
                        onChange={(e) => set("twitterImageUrl", e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="robots" className="mt-4 space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      {(
                        [
                          ["noIndex", "noindex — hide from search results"],
                          ["noFollow", "nofollow — do not follow links"],
                          ["noArchive", "noarchive — no cached copy"],
                          ["noSnippet", "nosnippet — no text snippet"],
                          ["noImageIndex", "noimageindex — do not index images"],
                        ] as const
                      ).map(([key, label]) => (
                        <div
                          key={key}
                          className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3"
                        >
                          <Switch checked={form[key]} onCheckedChange={(value) => set(key, value)} />
                          <Label>{label}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Max snippet</Label>
                        <Input
                          type="number"
                          value={form.maxSnippet}
                          placeholder="Inherit"
                          onChange={(e) => set("maxSnippet", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max image preview</Label>
                        <Select
                          value={form.maxImagePreview}
                          onValueChange={(value) => value && set("maxImagePreview", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inherit">Inherit global</SelectItem>
                            {SEO_IMAGE_PREVIEWS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option.toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Max video preview</Label>
                        <Input
                          type="number"
                          value={form.maxVideoPreview}
                          placeholder="Inherit"
                          onChange={(e) => set("maxVideoPreview", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sitemap" className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={form.includeInSitemap}
                        onCheckedChange={(value) => set("includeInSitemap", value)}
                      />
                      <Label>Include this route in the XML sitemap</Label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min={0}
                          max={1}
                          value={form.sitemapPriority}
                          placeholder="Inherit"
                          onChange={(e) => set("sitemapPriority", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Change frequency</Label>
                        <Select
                          value={form.sitemapChangeFreq}
                          onValueChange={(value) => value && set("sitemapChangeFreq", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inherit">Inherit global</SelectItem>
                            {SEO_CHANGE_FREQUENCIES.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option.toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <PairListField
                      label="Hreflang alternates"
                      values={form.hreflangEntries.map((entry) => ({
                        first: entry.hreflang,
                        second: entry.href,
                      }))}
                      onChange={(values) =>
                        set(
                          "hreflangEntries",
                          values
                            .filter((value) => value.first.trim() && value.second.trim())
                            .map((value) => ({ hreflang: value.first, href: value.second })),
                        )
                      }
                      firstPlaceholder="hi-IN"
                      secondPlaceholder="/hi/about"
                      addLabel="Add alternate"
                    />
                  </TabsContent>

                  <TabsContent value="aeo" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Answer summary</Label>
                      <Textarea
                        rows={3}
                        value={form.aiSummary}
                        placeholder="One paragraph an assistant can quote when asked about this page."
                        onChange={(e) => set("aiSummary", e.target.value)}
                      />
                    </div>
                    <StringListField
                      label="Speakable selectors"
                      values={form.speakableSelectors}
                      onChange={(values) => set("speakableSelectors", values)}
                      placeholder="h1"
                      hint="Overrides the global selectors for this route."
                      addLabel="Add selector"
                    />
                  </TabsContent>

                  <TabsContent value="schema" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Custom JSON-LD</Label>
                      <Textarea
                        rows={12}
                        className="font-mono text-xs"
                        value={form.customJsonLd}
                        placeholder='{ "@type": "Service", "name": "GST Advisory" }'
                        onChange={(e) => set("customJsonLd", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        A single node or an array of nodes. The @context wrapper is added automatically.
                      </p>
                      {jsonError ? <p className="text-sm text-destructive">{jsonError}</p> : null}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeEditor}>
                    Cancel
                  </Button>
                  <SaveButton
                    loading={collection.saving}
                    label={editingId === "new" ? "Create route" : "Save route"}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </>
  );
}
