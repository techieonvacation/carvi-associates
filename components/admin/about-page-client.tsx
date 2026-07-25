"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AboutTab } from "@/lib/cms/types";

type AboutForm = {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  text: string;
  experienceValue: string;
  experienceLabel: string;
  collageOneUrl: string;
  collageTwoUrl: string;
  collageOneAlt: string;
  collageTwoAlt: string;
  defaultTabId: string | null;
  taglineBg: string;
  tabs: AboutTab[];
  checklist: string[];
};

type AboutPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AboutPageClient({ user }: AboutPageProps) {
  const [form, setForm] = useState<AboutForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/about");
      const data = await response.json();
      setForm({
        ...data.about,
        defaultTabId: data.about.defaultTabId ?? null,
        tabs: Array.isArray(data.about.tabs) ? data.about.tabs : [],
        checklist: Array.isArray(data.about.checklist) ? data.about.checklist : [],
      });
      setLoading(false);
    }
    void load();
  }, []);

  function updateTab(index: number, patch: Partial<AboutTab>) {
    if (!form) return;
    setForm({
      ...form,
      tabs: form.tabs.map((tab, tabIndex) =>
        tabIndex === index ? { ...tab, ...patch } : tab,
      ),
    });
  }

  function addTab() {
    if (!form) return;
    const label = `New Tab ${form.tabs.length + 1}`;
    setForm({
      ...form,
      tabs: [
        ...form.tabs,
        {
          id: slugify(label) || `tab-${form.tabs.length + 1}`,
          label,
          image: "/images/about/about-1-3.jpg",
        },
      ],
    });
  }

  function removeTab(index: number) {
    if (!form || form.tabs.length <= 1) return;
    const nextTabs = form.tabs.filter((_, tabIndex) => tabIndex !== index);
    const defaultTabId =
      form.defaultTabId && nextTabs.some((tab) => tab.id === form.defaultTabId)
        ? form.defaultTabId
        : (nextTabs[1]?.id ?? nextTabs[0]?.id ?? null);
    setForm({ ...form, tabs: nextTabs, defaultTabId });
  }

  function updateChecklist(index: number, value: string) {
    if (!form) return;
    setForm({
      ...form,
      checklist: form.checklist.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    });
  }

  function addChecklistItem() {
    if (!form) return;
    setForm({ ...form, checklist: [...form.checklist, "New checklist item."] });
  }

  function removeChecklistItem(index: number) {
    if (!form || form.checklist.length <= 1) return;
    setForm({
      ...form,
      checklist: form.checklist.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setForm({
        ...data.about,
        defaultTabId: data.about.defaultTabId ?? null,
        tabs: Array.isArray(data.about.tabs) ? data.about.tabs : [],
        checklist: Array.isArray(data.about.checklist) ? data.about.checklist : [],
      });
      toast.success("About section updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="About"
        description="Edit the about collage, copy, experience badge, tabs, and checklist."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {loading || !form ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : (
            <Tabs defaultValue="general" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="tabs">Tabs</TabsTrigger>
                  <TabsTrigger value="checklist">Checklist</TabsTrigger>
                </TabsList>
                <Badge variant="secondary">
                  {form.tabs.length} tabs · {form.checklist.length} checklist
                </Badge>
              </div>

              <TabsContent value="general" className="space-y-6">
                <Card className="border-border/70">
                  <CardHeader>
                    <CardTitle>Copy</CardTitle>
                    <CardDescription>
                      Tagline, heading lines, and supporting paragraph shown beside the collage.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="about-tagline">Tagline</Label>
                      <Input
                        id="about-tagline"
                        value={form.tagline}
                        onChange={(event) => setForm({ ...form, tagline: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-title-1">Heading line 1</Label>
                      <Input
                        id="about-title-1"
                        value={form.titleLine1}
                        onChange={(event) => setForm({ ...form, titleLine1: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-title-2">Heading line 2</Label>
                      <Input
                        id="about-title-2"
                        value={form.titleLine2}
                        onChange={(event) => setForm({ ...form, titleLine2: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="about-text">Description</Label>
                      <Textarea
                        id="about-text"
                        value={form.text}
                        onChange={(event) => setForm({ ...form, text: event.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-tagline-bg">Tagline background</Label>
                      <Input
                        id="about-tagline-bg"
                        value={form.taglineBg}
                        onChange={(event) => setForm({ ...form, taglineBg: event.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/70">
                  <CardHeader>
                    <CardTitle>Experience badge</CardTitle>
                    <CardDescription>
                      The overlapping years badge on the secondary collage image.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="about-experience-value">Value</Label>
                      <Input
                        id="about-experience-value"
                        value={form.experienceValue}
                        onChange={(event) =>
                          setForm({ ...form, experienceValue: event.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-experience-label">Label</Label>
                      <Input
                        id="about-experience-label"
                        value={form.experienceLabel}
                        onChange={(event) =>
                          setForm({ ...form, experienceLabel: event.target.value })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="space-y-6">
                <Card className="border-border/70">
                  <CardHeader>
                    <CardTitle>Collage images</CardTitle>
                    <CardDescription>
                      Primary and secondary photos in the about collage. Decorative shapes stay
                      static.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ImageField
                      label="Primary collage image"
                      value={form.collageOneUrl}
                      onChange={(collageOneUrl) => setForm({ ...form, collageOneUrl })}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="about-collage-one-alt">Primary image alt text</Label>
                      <Input
                        id="about-collage-one-alt"
                        value={form.collageOneAlt}
                        onChange={(event) =>
                          setForm({ ...form, collageOneAlt: event.target.value })
                        }
                      />
                    </div>
                    <ImageField
                      label="Secondary collage image"
                      value={form.collageTwoUrl}
                      onChange={(collageTwoUrl) => setForm({ ...form, collageTwoUrl })}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="about-collage-two-alt">Secondary image alt text</Label>
                      <Input
                        id="about-collage-two-alt"
                        value={form.collageTwoAlt}
                        onChange={(event) =>
                          setForm({ ...form, collageTwoAlt: event.target.value })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tabs" className="space-y-6">
                <Card className="border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle>Content tabs</CardTitle>
                      <CardDescription>
                        Each tab has a label and side image. Checklist copy is shared across tabs.
                      </CardDescription>
                    </div>
                    <Button type="button" variant="outline" onClick={addTab}>
                      <Plus className="size-4" />
                      Add tab
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 max-w-sm">
                      <Label>Default active tab</Label>
                      <Select
                        value={form.defaultTabId ?? form.tabs[0]?.id}
                        onValueChange={(defaultTabId) => {
                          if (defaultTabId) setForm({ ...form, defaultTabId });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {form.tabs.map((tab) => (
                            <SelectItem key={tab.id} value={tab.id}>
                              {tab.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {form.tabs.map((tab, index) => (
                      <div
                        key={`${tab.id}-${index}`}
                        className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-medium text-muted-foreground">
                            Tab #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTab(index)}
                            aria-label="Remove tab"
                            disabled={form.tabs.length <= 1}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                              value={tab.label}
                              onChange={(event) => {
                                const label = event.target.value;
                                const nextId = slugify(label) || tab.id;
                                setForm((current) => {
                                  if (!current) return current;
                                  return {
                                    ...current,
                                    defaultTabId:
                                      current.defaultTabId === tab.id
                                        ? nextId
                                        : current.defaultTabId,
                                    tabs: current.tabs.map((item, itemIndex) =>
                                      itemIndex === index
                                        ? { ...item, label, id: nextId }
                                        : item,
                                    ),
                                  };
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Id (slug)</Label>
                            <Input
                              value={tab.id}
                              onChange={(event) =>
                                updateTab(index, { id: slugify(event.target.value) || tab.id })
                              }
                            />
                          </div>
                        </div>
                        <ImageField
                          label="Tab image"
                          value={tab.image}
                          onChange={(image) => updateTab(index, { image })}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="checklist" className="space-y-6">
                <Card className="border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle>Checklist</CardTitle>
                      <CardDescription>
                        Shared list shown inside every tab panel. Checkmark icon stays static.
                      </CardDescription>
                    </div>
                    <Button type="button" variant="outline" onClick={addChecklistItem}>
                      <Plus className="size-4" />
                      Add item
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {form.checklist.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                          <Label>Item #{index + 1}</Label>
                          <Input
                            value={item}
                            onChange={(event) => updateChecklist(index, event.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-7"
                          onClick={() => removeChecklistItem(index)}
                          aria-label="Remove checklist item"
                          disabled={form.checklist.length <= 1}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end">
            <SaveButton loading={saving} disabled={loading || !form} />
          </div>
        </form>
      </main>
    </>
  );
}
