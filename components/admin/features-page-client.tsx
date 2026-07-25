"use client";

import { useEffect, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FEATURE_ICON_OPTIONS, type FeatureItem } from "@/lib/cms/types";

type FeaturesPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

export function FeaturesPageClient({ user }: FeaturesPageProps) {
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/features");
      const data = await response.json();
      setFeatures(
        Array.isArray(data.features)
          ? data.features.map((feature: FeatureItem, index: number) => ({
              ...feature,
              href: feature.href ?? "#",
              sortOrder: feature.sortOrder ?? index,
              visible: feature.visible ?? true,
            }))
          : [],
      );
      setLoading(false);
    }
    void load();
  }, []);

  function updateFeature(index: number, patch: Partial<FeatureItem>) {
    setFeatures((current) =>
      current.map((feature, featureIndex) =>
        featureIndex === index ? { ...feature, ...patch } : feature,
      ),
    );
  }

  function addFeature() {
    setFeatures((current) => [
      ...current,
      {
        icon: "icon-risk",
        title: "New Feature",
        text: "Describe this feature for visitors.",
        href: "#",
        sortOrder: current.length,
        visible: true,
      },
    ]);
  }

  function removeFeature(index: number) {
    setFeatures((current) =>
      current
        .filter((_, featureIndex) => featureIndex !== index)
        .map((feature, featureIndex) => ({ ...feature, sortOrder: featureIndex })),
    );
  }

  function moveFeature(index: number, direction: -1 | 1) {
    setFeatures((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next.map((feature, featureIndex) => ({
        ...feature,
        sortOrder: featureIndex,
      }));
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!features.length) {
      toast.error("Add at least one feature");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        features: features.map((feature, index) => ({
          icon: feature.icon,
          title: feature.title,
          text: feature.text,
          href: feature.href || "#",
          sortOrder: index,
          visible: feature.visible,
        })),
      };
      const response = await fetch("/api/admin/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setFeatures(
        data.features.map((feature: FeatureItem, index: number) => ({
          ...feature,
          href: feature.href ?? "#",
          sortOrder: feature.sortOrder ?? index,
        })),
      );
      toast.success("Features section updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const visibleCount = features.filter((feature) => feature.visible).length;

  return (
    <>
      <AdminHeader
        user={user}
        title="Features"
        description="Manage the three icon cards under the partner marquee."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Feature cards</CardTitle>
                <CardDescription>
                  Icon, title, and short copy for each card. Hidden cards stay in CMS but leave
                  the public site.
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {visibleCount} visible / {features.length} total
                </Badge>
                <Button type="button" variant="outline" onClick={addFeature} disabled={loading}>
                  <Plus className="size-4" />
                  Add feature
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div
                      key={`${feature.id ?? "new"}-${index}`}
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
                              onClick={() => moveFeature(index, -1)}
                              disabled={index === 0}
                            >
                              Up
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveFeature(index, 1)}
                              disabled={index === features.length - 1}
                            >
                              Down
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={feature.visible}
                              onCheckedChange={(visible) => updateFeature(index, { visible })}
                            />
                            <Label>Visible</Label>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFeature(index)}
                            aria-label="Remove feature"
                            disabled={features.length <= 1}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={feature.icon}
                            onValueChange={(icon) => {
                              if (icon) updateFeature(index, { icon });
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
                                feature.icon as (typeof FEATURE_ICON_OPTIONS)[number],
                              ) ? (
                                <SelectItem value={feature.icon}>{feature.icon}</SelectItem>
                              ) : null}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={feature.title}
                            onChange={(event) =>
                              updateFeature(index, { title: event.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Link</Label>
                          <Input
                            value={feature.href}
                            onChange={(event) =>
                              updateFeature(index, { href: event.target.value })
                            }
                            placeholder="#"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Preview</Label>
                          <div className="flex h-9 items-center gap-2 rounded-xl border border-dashed border-border/80 bg-background px-3 text-sm">
                            <span className="flex size-7 items-center justify-center rounded-md bg-accent text-white">
                              <i className={feature.icon} aria-hidden="true" />
                            </span>
                            <span className="truncate">{feature.title}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={feature.text}
                          onChange={(event) => updateFeature(index, { text: event.target.value })}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}

                  {!features.length ? (
                    <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                      No features yet. Add your first card to populate the section.
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <SaveButton loading={saving} />
          </div>
        </form>
      </main>
    </>
  );
}
