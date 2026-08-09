"use client";

import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  FEATURE_ICON_OPTIONS,
  PROJECT_TAG_TONES,
  type ProjectCardItem,
  type ProjectCategoryItem,
  type ProjectTagTone,
} from "@/lib/cms/types";

type SectionForm = {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  taglineBg: string;
  topBackgroundImageUrl: string;
  bottomBackgroundImageUrl: string;
  showFilters: boolean;
  allFilterLabel: string;
  showBottomBanner: boolean;
  bannerStat: string;
  bannerTitleLine1: string;
  bannerTitleLine2: string;
  bannerChecklist: string[];
  bannerButtonText: string;
  bannerButtonHref: string;
  isVisible: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  twitterImageUrl: string;
  noIndex: boolean;
};

type ProjectsPageProps = {
  user: { name: string; email: string; role: "ADMIN" | "MANAGER" };
};

const NO_CATEGORY = "__none__";

const TONE_LABELS: Record<ProjectTagTone, string> = {
  primary: "Primary (sand)",
  light: "Light (white)",
  accent: "Accent (olive)",
};

function isPersisted(id: string) {
  return !id.startsWith("new-") && !id.startsWith("fallback-");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjectsPageClient({ user }: ProjectsPageProps) {
  const [section, setSection] = useState<SectionForm | null>(null);
  const [categories, setCategories] = useState<ProjectCategoryItem[]>([]);
  const [items, setItems] = useState<ProjectCardItem[]>([]);
  const [trashed, setTrashed] = useState<ProjectCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [savingCategories, setSavingCategories] = useState(false);
  const [savingItems, setSavingItems] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadTrash = useCallback(async () => {
    const response = await fetch("/api/admin/projects/items?trash=true");
    const data = await response.json();
    setTrashed(Array.isArray(data.items) ? data.items : []);
  }, []);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const [sectionRes, categoriesRes, itemsRes, trashRes] = await Promise.all([
          fetch("/api/admin/projects"),
          fetch("/api/admin/projects/categories"),
          fetch("/api/admin/projects/items"),
          fetch("/api/admin/projects/items?trash=true"),
        ]);
        const sectionData = await sectionRes.json();
        const categoriesData = await categoriesRes.json();
        const itemsData = await itemsRes.json();
        const trashData = await trashRes.json();
        if (!active) return;
        startTransition(() => {
          setSection({
            ...sectionData.projects,
            seoTitle: sectionData.projects.seoTitle ?? "",
            seoDescription: sectionData.projects.seoDescription ?? "",
            seoKeywords: sectionData.projects.seoKeywords ?? "",
            canonicalUrl: sectionData.projects.canonicalUrl ?? "",
            ogImageUrl: sectionData.projects.ogImageUrl ?? "",
            twitterImageUrl: sectionData.projects.twitterImageUrl ?? "",
          });
          setCategories(
            Array.isArray(categoriesData.categories) ? categoriesData.categories : [],
          );
          setItems(Array.isArray(itemsData.items) ? itemsData.items : []);
          setTrashed(Array.isArray(trashData.items) ? trashData.items : []);
          setLoading(false);
        });
      } catch {
        if (!active) return;
        toast.error("Failed to load Case Studies");
        startTransition(() => setLoading(false));
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      live: items.filter((item) => item.isVisible && item.isActive).length,
      featured: items.filter((item) => item.isFeatured).length,
    }),
    [items],
  );

  function updateSection(patch: Partial<SectionForm>) {
    setSection((current) => (current ? { ...current, ...patch } : current));
  }

  function updateItem(index: number, patch: Partial<ProjectCardItem>) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function updateCategory(index: number, patch: Partial<ProjectCategoryItem>) {
    setCategories((current) =>
      current.map((category, categoryIndex) =>
        categoryIndex === index ? { ...category, ...patch } : category,
      ),
    );
  }

  function addCategory() {
    setCategories((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        label: "New category",
        slug: `category-${current.length + 1}`,
        displayOrder: current.length,
        isVisible: true,
        isActive: true,
        deletedAt: null,
      },
    ]);
  }

  function removeCategory(index: number) {
    setCategories((current) =>
      current
        .filter((_, categoryIndex) => categoryIndex !== index)
        .map((category, categoryIndex) => ({ ...category, displayOrder: categoryIndex })),
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        title: "New case study",
        text: "One-line outcome for this engagement.",
        icon: "icon-business-and-finance",
        imageUrl: "/images/projects/project-1-1.jpg",
        imageAlt: "New case study",
        href: "#",
        slug: null,
        categorySlug: categories[0]?.slug ?? null,
        tags: [{ label: "Advisory", href: "#", tone: "primary" }],
        displayOrder: current.length,
        isFeatured: false,
        isVisible: true,
        isActive: true,
        deletedAt: null,
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((current) =>
      current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({ ...item, displayOrder: itemIndex })),
    );
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next.map((item, itemIndex) => ({ ...item, displayOrder: itemIndex }));
    });
  }

  function updateTag(
    itemIndex: number,
    tagIndex: number,
    patch: Partial<ProjectCardItem["tags"][number]>,
  ) {
    setItems((current) =>
      current.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              tags: item.tags.map((tag, currentTagIndex) =>
                currentTagIndex === tagIndex ? { ...tag, ...patch } : tag,
              ),
            }
          : item,
      ),
    );
  }

  function addTag(itemIndex: number) {
    setItems((current) =>
      current.map((item, index) =>
        index === itemIndex && item.tags.length < 4
          ? {
              ...item,
              tags: [
                ...item.tags,
                {
                  label: "Tag",
                  href: "#",
                  tone: item.tags.length === 0 ? "primary" : "light",
                },
              ],
            }
          : item,
      ),
    );
  }

  function removeTag(itemIndex: number, tagIndex: number) {
    setItems((current) =>
      current.map((item, index) =>
        index === itemIndex
          ? { ...item, tags: item.tags.filter((_, i) => i !== tagIndex) }
          : item,
      ),
    );
  }

  async function runItemAction(
    id: string,
    action:
      | "duplicate"
      | "feature"
      | "unfeature"
      | "soft-delete"
      | "restore"
      | "hard-delete",
  ) {
    if (!isPersisted(id)) {
      toast.error("Save the case study before running this action");
      return;
    }
    setBusyId(id);
    try {
      const response = await fetch("/api/admin/projects/items/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id], action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Action failed");

      const [itemsRes] = await Promise.all([
        fetch("/api/admin/projects/items"),
        loadTrash(),
      ]);
      const itemsData = await itemsRes.json();
      setItems(Array.isArray(itemsData.items) ? itemsData.items : []);
      toast.success("Case studies updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  async function saveSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!section) return;
    setSavingSection(true);
    try {
      const response = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...section,
          bannerChecklist: section.bannerChecklist.filter((line) => line.trim().length),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setSection({
        ...data.projects,
        seoTitle: data.projects.seoTitle ?? "",
        seoDescription: data.projects.seoDescription ?? "",
        seoKeywords: data.projects.seoKeywords ?? "",
        canonicalUrl: data.projects.canonicalUrl ?? "",
        ogImageUrl: data.projects.ogImageUrl ?? "",
        twitterImageUrl: data.projects.twitterImageUrl ?? "",
      });
      toast.success("Case Studies section updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingSection(false);
    }
  }

  async function saveCategories(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingCategories(true);
    try {
      const response = await fetch("/api/admin/projects/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: categories.map((category, index) => ({
            id: isPersisted(category.id) ? category.id : undefined,
            label: category.label,
            slug: category.slug,
            displayOrder: index,
            isVisible: category.isVisible,
            isActive: category.isActive,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setCategories(data.categories);
      toast.success("Filter categories updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingCategories(false);
    }
  }

  async function saveItems(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingItems(true);
    try {
      const response = await fetch("/api/admin/projects/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item, index) => ({
            id: isPersisted(item.id) ? item.id : undefined,
            title: item.title,
            text: item.text,
            icon: item.icon,
            imageUrl: item.imageUrl,
            imageAlt: item.imageAlt,
            href: item.href || "#",
            slug: item.slug ?? "",
            categorySlug: item.categorySlug,
            tags: item.tags,
            displayOrder: index,
            isFeatured: item.isFeatured,
            isVisible: item.isVisible,
            isActive: item.isActive,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setItems(data.items);
      await loadTrash();
      toast.success("Case studies updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingItems(false);
    }
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Case Studies"
        description="Manage the case-studies band — heading, filter categories, cards, and the bottom banner."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Section settings</CardTitle>
            <CardDescription>
              Badge, title, backgrounds, filter behaviour, bottom banner, and SEO.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !section ? (
              <div className="h-48 animate-pulse rounded-xl bg-muted" />
            ) : (
              <form onSubmit={saveSection} className="space-y-6">
                <Tabs defaultValue="general">
                  <TabsList className="flex h-auto flex-wrap">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="banner">Bottom banner</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                      <Switch
                        checked={section.isVisible}
                        onCheckedChange={(isVisible) => updateSection({ isVisible })}
                      />
                      <div>
                        <Label>Section visible</Label>
                        <p className="text-xs text-muted-foreground">
                          Hidden sections stay in the CMS but leave the public homepage.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Section badge</Label>
                        <Input
                          value={section.tagline}
                          onChange={(event) =>
                            updateSection({ tagline: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tagline background</Label>
                        <Input
                          value={section.taglineBg}
                          onChange={(event) =>
                            updateSection({ taglineBg: event.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={section.showFilters}
                          onCheckedChange={(showFilters) => updateSection({ showFilters })}
                        />
                        <Label>Show category filters</Label>
                      </div>
                      <div className="space-y-2">
                        <Label>&ldquo;All&rdquo; filter label</Label>
                        <Input
                          value={section.allFilterLabel}
                          onChange={(event) =>
                            updateSection({ allFilterLabel: event.target.value })
                          }
                        />
                      </div>
                    </div>
                    <ImageField
                      label="Top band background"
                      value={section.topBackgroundImageUrl}
                      onChange={(topBackgroundImageUrl) =>
                        updateSection({ topBackgroundImageUrl })
                      }
                    />
                  </TabsContent>

                  <TabsContent value="content" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Title line 1</Label>
                        <Input
                          value={section.titleLine1}
                          onChange={(event) =>
                            updateSection({ titleLine1: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title line 2</Label>
                        <Input
                          value={section.titleLine2}
                          onChange={(event) =>
                            updateSection({ titleLine2: event.target.value })
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="banner" className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                      <Switch
                        checked={section.showBottomBanner}
                        onCheckedChange={(showBottomBanner) =>
                          updateSection({ showBottomBanner })
                        }
                      />
                      <Label>Show bottom banner</Label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Stat</Label>
                        <Input
                          value={section.bannerStat}
                          onChange={(event) =>
                            updateSection({ bannerStat: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Banner title line 1</Label>
                        <Input
                          value={section.bannerTitleLine1}
                          onChange={(event) =>
                            updateSection({ bannerTitleLine1: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Banner title line 2</Label>
                        <Input
                          value={section.bannerTitleLine2}
                          onChange={(event) =>
                            updateSection({ bannerTitleLine2: event.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label>Checklist lines</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateSection({
                              bannerChecklist: [...section.bannerChecklist, "New highlight"],
                            })
                          }
                        >
                          <Plus className="size-4" />
                          Add line
                        </Button>
                      </div>
                      {section.bannerChecklist.map((line, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={line}
                            onChange={(event) =>
                              updateSection({
                                bannerChecklist: section.bannerChecklist.map((current, i) =>
                                  i === index ? event.target.value : current,
                                ),
                              })
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Remove line"
                            onClick={() =>
                              updateSection({
                                bannerChecklist: section.bannerChecklist.filter(
                                  (_, i) => i !== index,
                                ),
                              })
                            }
                          >
                            <X className="size-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Button text</Label>
                        <Input
                          value={section.bannerButtonText}
                          onChange={(event) =>
                            updateSection({ bannerButtonText: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Button link</Label>
                        <Input
                          value={section.bannerButtonHref}
                          onChange={(event) =>
                            updateSection({ bannerButtonHref: event.target.value })
                          }
                        />
                      </div>
                    </div>
                    <ImageField
                      label="Banner background"
                      value={section.bottomBackgroundImageUrl}
                      onChange={(bottomBackgroundImageUrl) =>
                        updateSection({ bottomBackgroundImageUrl })
                      }
                    />
                  </TabsContent>

                  <TabsContent value="seo" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>SEO title</Label>
                        <Input
                          value={section.seoTitle}
                          onChange={(event) =>
                            updateSection({ seoTitle: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Canonical URL</Label>
                        <Input
                          value={section.canonicalUrl}
                          onChange={(event) =>
                            updateSection({ canonicalUrl: event.target.value })
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
                          updateSection({ seoDescription: event.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Keywords</Label>
                      <Input
                        value={section.seoKeywords}
                        onChange={(event) =>
                          updateSection({ seoKeywords: event.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Open Graph image</Label>
                        <Input
                          value={section.ogImageUrl}
                          onChange={(event) =>
                            updateSection({ ogImageUrl: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Twitter image</Label>
                        <Input
                          value={section.twitterImageUrl}
                          onChange={(event) =>
                            updateSection({ twitterImageUrl: event.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={section.noIndex}
                        onCheckedChange={(noIndex) => updateSection({ noIndex })}
                      />
                      <Label>NoIndex</Label>
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

        <Card className="border-border/70">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Filter categories</CardTitle>
              <CardDescription>
                The tab row above the cards. Slugs link a card to its category.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addCategory}
              disabled={loading}
            >
              <Plus className="size-4" />
              Add category
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
            ) : (
              <form onSubmit={saveCategories} className="space-y-4">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="grid gap-4 rounded-xl border border-border/70 bg-muted/20 p-4 md:grid-cols-[1fr_1fr_auto]"
                  >
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={category.label}
                        onChange={(event) =>
                          updateCategory(index, {
                            label: event.target.value,
                            slug: isPersisted(category.id)
                              ? category.slug
                              : slugify(event.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug</Label>
                      <Input
                        value={category.slug}
                        onChange={(event) =>
                          updateCategory(index, { slug: slugify(event.target.value) })
                        }
                      />
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.isVisible}
                          onCheckedChange={(isVisible) =>
                            updateCategory(index, { isVisible })
                          }
                        />
                        <Label>Visible</Label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove category"
                        onClick={() => removeCategory(index)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                {!categories.length ? (
                  <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No categories — the filter row is hidden on the homepage.
                  </div>
                ) : null}

                <div className="flex justify-end">
                  <SaveButton loading={savingCategories} label="Save categories" />
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Case study cards</CardTitle>
              <CardDescription>
                Image, hover icon, title, outcome line, tags, category, and CTA link.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {stats.live} live / {items.length} total
              </Badge>
              <Badge variant="outline">{stats.featured} featured</Badge>
              <Button type="button" variant="outline" onClick={addItem} disabled={loading}>
                <Plus className="size-4" />
                Add case study
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="trash">Trash ({trashed.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4">
                <form onSubmit={saveItems} className="space-y-4">
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-56 animate-pulse rounded-xl bg-muted" />
                      ))}
                    </div>
                  ) : (
                    items.map((item, index) => (
                      <div
                        key={item.id}
                        className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <GripVertical className="size-4" />
                            <span className="text-xs font-medium">#{index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Move up"
                              disabled={index === 0}
                              onClick={() => moveItem(index, -1)}
                            >
                              <ArrowUp className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Move down"
                              disabled={index === items.length - 1}
                              onClick={() => moveItem(index, 1)}
                            >
                              <ArrowDown className="size-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={item.isVisible}
                                onCheckedChange={(isVisible) =>
                                  updateItem(index, { isVisible })
                                }
                              />
                              <Label>Visible</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={item.isActive}
                                onCheckedChange={(isActive) => updateItem(index, { isActive })}
                              />
                              <Label>Active</Label>
                            </div>
                            <Button
                              type="button"
                              variant={item.isFeatured ? "default" : "ghost"}
                              size="icon"
                              aria-label="Toggle featured"
                              onClick={() => updateItem(index, { isFeatured: !item.isFeatured })}
                            >
                              <Star className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Duplicate case study"
                              disabled={busyId === item.id || !isPersisted(item.id)}
                              onClick={() => runItemAction(item.id, "duplicate")}
                            >
                              <Copy className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Move to trash"
                              disabled={busyId === item.id}
                              onClick={() =>
                                isPersisted(item.id)
                                  ? runItemAction(item.id, "soft-delete")
                                  : removeItem(index)
                              }
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={item.title}
                              onChange={(event) =>
                                updateItem(index, { title: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Slug</Label>
                            <Input
                              value={item.slug ?? ""}
                              placeholder="auto from title"
                              onChange={(event) =>
                                updateItem(index, { slug: slugify(event.target.value) || null })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                              value={item.categorySlug ?? NO_CATEGORY}
                              onValueChange={(value) => {
                                if (!value) return;
                                updateItem(index, {
                                  categorySlug: value === NO_CATEGORY ? null : value,
                                });
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={NO_CATEGORY}>Uncategorised</SelectItem>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.slug}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Hover icon</Label>
                            <Select
                              value={item.icon}
                              onValueChange={(icon) => {
                                if (icon) updateItem(index, { icon });
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FEATURE_ICON_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    <span className="inline-flex items-center gap-2">
                                      <i className={option} aria-hidden="true" />
                                      {option.replace("icon-", "")}
                                    </span>
                                  </SelectItem>
                                ))}
                                {!FEATURE_ICON_OPTIONS.includes(
                                  item.icon as (typeof FEATURE_ICON_OPTIONS)[number],
                                ) ? (
                                  <SelectItem value={item.icon}>{item.icon}</SelectItem>
                                ) : null}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Outcome line</Label>
                            <Textarea
                              rows={2}
                              value={item.text}
                              onChange={(event) =>
                                updateItem(index, { text: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Card link</Label>
                              <Input
                                value={item.href}
                                onChange={(event) =>
                                  updateItem(index, { href: event.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Image alt text</Label>
                              <Input
                                value={item.imageAlt}
                                onChange={(event) =>
                                  updateItem(index, { imageAlt: event.target.value })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <ImageField
                          label="Card image"
                          value={item.imageUrl}
                          onChange={(imageUrl) => updateItem(index, { imageUrl })}
                        />

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <Label>Tags (max 4)</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={item.tags.length >= 4}
                              onClick={() => addTag(index)}
                            >
                              <Plus className="size-4" />
                              Add tag
                            </Button>
                          </div>
                          {item.tags.map((tag, tagIndex) => (
                            <div
                              key={tagIndex}
                              className="grid gap-3 rounded-xl border border-border/60 bg-background p-3 md:grid-cols-[1fr_1fr_1fr_auto]"
                            >
                              <div className="space-y-2">
                                <Label>Label</Label>
                                <Input
                                  value={tag.label}
                                  onChange={(event) =>
                                    updateTag(index, tagIndex, { label: event.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Link</Label>
                                <Input
                                  value={tag.href}
                                  onChange={(event) =>
                                    updateTag(index, tagIndex, { href: event.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Tone</Label>
                                <Select
                                  value={tag.tone}
                                  onValueChange={(tone) => {
                                    if (tone) {
                                      updateTag(index, tagIndex, {
                                        tone: tone as ProjectTagTone,
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PROJECT_TAG_TONES.map((tone) => (
                                      <SelectItem key={tone} value={tone}>
                                        {TONE_LABELS[tone]}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-end">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Remove tag"
                                  onClick={() => removeTag(index, tagIndex)}
                                >
                                  <X className="size-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}

                  {!loading && !items.length ? (
                    <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                      No case studies yet. Add your first engagement.
                    </div>
                  ) : null}

                  <div className="flex justify-end">
                    <SaveButton loading={savingItems} label="Save case studies" />
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="trash" className="mt-4 space-y-3">
                {trashed.length ? (
                  trashed.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{item.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.text}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busyId === item.id}
                          onClick={() => runItemAction(item.id, "restore")}
                        >
                          <RotateCcw className="size-4" />
                          Restore
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={busyId === item.id}
                          onClick={() => runItemAction(item.id, "hard-delete")}
                        >
                          <XCircle className="size-4 text-destructive" />
                          Delete forever
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                    Trash is empty.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
