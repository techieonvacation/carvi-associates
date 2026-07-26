"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
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
import { FEATURE_ICON_OPTIONS, type WhyChooseItem } from "@/lib/cms/types";

type SectionForm = {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  taglineBg: string;
  imageUrl: string;
  imageAlt: string;
  shapeImageUrl: string;
  isVisible: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  twitterImageUrl: string;
  noIndex: boolean;
};

type WhyChoosePageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

export function WhyChoosePageClient({ user }: WhyChoosePageProps) {
  const [section, setSection] = useState<SectionForm | null>(null);
  const [items, setItems] = useState<WhyChooseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [savingItems, setSavingItems] = useState(false);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const [sectionRes, itemsRes] = await Promise.all([
          fetch("/api/admin/why-choose"),
          fetch("/api/admin/why-choose/items"),
        ]);
        const sectionData = await sectionRes.json();
        const itemsData = await itemsRes.json();
        if (!active) return;
        startTransition(() => {
          setSection({
            tagline: sectionData.whyChoose.tagline ?? "",
            titleLine1: sectionData.whyChoose.titleLine1 ?? "",
            titleLine2: sectionData.whyChoose.titleLine2 ?? "",
            description: sectionData.whyChoose.description ?? "",
            taglineBg: sectionData.whyChoose.taglineBg ?? "#f4ebd8",
            imageUrl: sectionData.whyChoose.imageUrl ?? "",
            imageAlt: sectionData.whyChoose.imageAlt ?? "",
            shapeImageUrl: sectionData.whyChoose.shapeImageUrl ?? "",
            isVisible: sectionData.whyChoose.isVisible ?? true,
            seoTitle: sectionData.whyChoose.seoTitle ?? "",
            seoDescription: sectionData.whyChoose.seoDescription ?? "",
            seoKeywords: sectionData.whyChoose.seoKeywords ?? "",
            canonicalUrl: sectionData.whyChoose.canonicalUrl ?? "",
            ogImageUrl: sectionData.whyChoose.ogImageUrl ?? "",
            twitterImageUrl: sectionData.whyChoose.twitterImageUrl ?? "",
            noIndex: sectionData.whyChoose.noIndex ?? false,
          });
          setItems(
            Array.isArray(itemsData.items)
              ? itemsData.items.map((item: WhyChooseItem, index: number) => ({
                  ...item,
                  href: item.href ?? "#",
                  displayOrder: item.displayOrder ?? index,
                  isVisible: item.isVisible ?? true,
                  isActive: item.isActive ?? true,
                }))
              : [],
          );
          setLoading(false);
        });
      } catch {
        if (!active) return;
        toast.error("Failed to load Why Choose Us");
        startTransition(() => setLoading(false));
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const visibleCount = useMemo(
    () => items.filter((item) => item.isVisible).length,
    [items],
  );

  function updateItem(index: number, patch: Partial<WhyChooseItem>) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        icon: "icon-market-research",
        title: "New reason",
        text: "Describe why clients choose this offering.",
        href: "#",
        displayOrder: current.length,
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
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next.map((row, rowIndex) => ({ ...row, displayOrder: rowIndex }));
    });
  }

  async function saveSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!section) return;
    setSavingSection(true);
    try {
      const response = await fetch("/api/admin/why-choose", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setSection({
        ...data.whyChoose,
        seoTitle: data.whyChoose.seoTitle ?? "",
        seoDescription: data.whyChoose.seoDescription ?? "",
        seoKeywords: data.whyChoose.seoKeywords ?? "",
        canonicalUrl: data.whyChoose.canonicalUrl ?? "",
        ogImageUrl: data.whyChoose.ogImageUrl ?? "",
        twitterImageUrl: data.whyChoose.twitterImageUrl ?? "",
      });
      toast.success("Why Choose Us section updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingSection(false);
    }
  }

  async function saveItems(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) {
      toast.error("Add at least one list item");
      return;
    }
    setSavingItems(true);
    try {
      const response = await fetch("/api/admin/why-choose/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item, index) => ({
            id: item.id.startsWith("new-") || item.id.startsWith("fallback-")
              ? undefined
              : item.id,
            icon: item.icon,
            title: item.title,
            text: item.text,
            href: item.href || "#",
            displayOrder: index,
            isVisible: item.isVisible,
            isActive: item.isActive,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setItems(data.items);
      toast.success("Why Choose Us items updated");
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
        title="Why Choose Us"
        description="Manage the two-column reasons section and feature image."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Section settings</CardTitle>
            <CardDescription>
              Badge, title, description, imagery, visibility, and SEO.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!section || loading ? (
              <div className="h-48 animate-pulse rounded-xl bg-muted" />
            ) : (
              <form onSubmit={saveSection} className="space-y-6">
                <Tabs defaultValue="general">
                  <TabsList className="flex h-auto flex-wrap">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                      <Switch
                        checked={section.isVisible}
                        onCheckedChange={(isVisible) =>
                          setSection({ ...section, isVisible })
                        }
                      />
                      <div>
                        <Label>Section visible</Label>
                        <p className="text-xs text-muted-foreground">
                          Hidden sections stay in CMS but leave the public homepage.
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
                        <Label>Tagline background</Label>
                        <Input
                          value={section.taglineBg}
                          onChange={(event) =>
                            setSection({ ...section, taglineBg: event.target.value })
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="content" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
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
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={4}
                        value={section.description}
                        onChange={(event) =>
                          setSection({ ...section, description: event.target.value })
                        }
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="images" className="mt-4 space-y-4">
                    <ImageField
                      label="Feature image"
                      value={section.imageUrl}
                      onChange={(imageUrl) => setSection({ ...section, imageUrl })}
                    />
                    <div className="space-y-2">
                      <Label>Image alt text</Label>
                      <Input
                        value={section.imageAlt}
                        onChange={(event) =>
                          setSection({ ...section, imageAlt: event.target.value })
                        }
                      />
                    </div>
                    <ImageField
                      label="Decorative shape image"
                      value={section.shapeImageUrl}
                      onChange={(shapeImageUrl) =>
                        setSection({ ...section, shapeImageUrl })
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
                      <div className="space-y-2">
                        <Label>Open Graph image</Label>
                        <Input
                          value={section.ogImageUrl}
                          onChange={(event) =>
                            setSection({ ...section, ogImageUrl: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Twitter image</Label>
                        <Input
                          value={section.twitterImageUrl}
                          onChange={(event) =>
                            setSection({
                              ...section,
                              twitterImageUrl: event.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={section.noIndex}
                        onCheckedChange={(noIndex) => setSection({ ...section, noIndex })}
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
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Reason list items</CardTitle>
              <CardDescription>
                Pill rows with icon, title, copy, and CTA link. Removed items are soft-deleted.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {visibleCount} visible / {items.length} total
              </Badge>
              <Button type="button" variant="outline" onClick={addItem} disabled={loading}>
                <Plus className="size-4" />
                Add item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveItems} className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
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
                        <div className="ml-2 flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveItem(index, -1)}
                            disabled={index === 0}
                          >
                            Up
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveItem(index, 1)}
                            disabled={index === items.length - 1}
                          >
                            Down
                          </Button>
                        </div>
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
                            onCheckedChange={(isActive) =>
                              updateItem(index, { isActive })
                            }
                          />
                          <Label>Active</Label>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          aria-label="Remove item"
                          disabled={items.length <= 1}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Icon</Label>
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
                        <Label>Link</Label>
                        <Input
                          value={item.href}
                          onChange={(event) =>
                            updateItem(index, { href: event.target.value })
                          }
                          placeholder="#"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="flex h-9 items-center gap-2 rounded-xl border border-dashed border-border/80 bg-background px-3 text-sm">
                          <span className="flex size-7 items-center justify-center rounded-full bg-accent text-white">
                            <i className={item.icon} aria-hidden="true" />
                          </span>
                          <span className="truncate">{item.title}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={item.text}
                        onChange={(event) =>
                          updateItem(index, { text: event.target.value })
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                ))
              )}

              {!loading && !items.length ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No items yet. Add your first reason to populate the section.
                </div>
              ) : null}

              <div className="flex justify-end">
                <SaveButton loading={savingItems} label="Save items" />
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
