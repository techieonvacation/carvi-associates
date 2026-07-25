"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { HeroStat, HeroTrustItem } from "@/lib/cms/types";

type HeroForm = {
  tagline: string;
  titleBeforeVideo: string;
  titleHighlight: string;
  titleAfterVideo: string;
  description: string;
  secondaryCtaText: string;
  ctaText: string;
  ctaHref: string;
  videoId: string | null;
  heroImageUrl: string;
  activeUserCount: number;
  activeUserSuffix: string;
  activeUserLabel: string;
  activeUserImages: string[];
  stats: HeroStat[];
  trust: HeroTrustItem[];
};

type HeroPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

const emptyStat = (): HeroStat => ({
  icon: "icon-trophy",
  end: 0,
  suffix: "+",
  label: "New stat",
});

const emptyTrust = (): HeroTrustItem => ({
  icon: "icon-satisfaction",
  label: "New trust signal",
});

export function HeroPageClient({ user }: HeroPageProps) {
  const [form, setForm] = useState<HeroForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/hero");
      const data = await response.json();
      setForm({
        ...data.hero,
        description: data.hero.description ?? "",
        secondaryCtaText: data.hero.secondaryCtaText ?? "Talk to an Expert",
        activeUserImages: Array.isArray(data.hero.activeUserImages)
          ? data.hero.activeUserImages
          : [],
        stats: Array.isArray(data.hero.stats) ? data.hero.stats : [],
        trust: Array.isArray(data.hero.trust) ? data.hero.trust : [],
      });
      setLoading(false);
    }
    void load();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setForm({
        ...data.hero,
        activeUserImages: Array.isArray(data.hero.activeUserImages)
          ? data.hero.activeUserImages
          : [],
        stats: Array.isArray(data.hero.stats) ? data.hero.stats : [],
        trust: Array.isArray(data.hero.trust) ? data.hero.trust : [],
      });
      toast.success("Hero section updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function updateStat(index: number, patch: Partial<HeroStat>) {
    if (!form) return;
    setForm({
      ...form,
      stats: form.stats.map((stat, statIndex) =>
        statIndex === index ? { ...stat, ...patch } : stat,
      ),
    });
  }

  function updateTrust(index: number, patch: Partial<HeroTrustItem>) {
    if (!form) return;
    setForm({
      ...form,
      trust: form.trust.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Hero Section"
        description="Manage headline, description, stats, trust signals, CTAs, and imagery."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Homepage hero</CardTitle>
              <CardDescription>
                Everything here maps 1:1 to the public homepage hero section.
              </CardDescription>
            </div>
            {form ? (
              <Badge variant="secondary">
                {form.stats.length} stats · {form.trust.length} trust
              </Badge>
            ) : null}
          </CardHeader>
          <CardContent>
            {loading || !form ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-10 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="trust">Trust</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-6 space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                          id="tagline"
                          value={form.tagline}
                          onChange={(event) =>
                            setForm({ ...form, tagline: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="titleBeforeVideo">Title before highlight</Label>
                        <Input
                          id="titleBeforeVideo"
                          value={form.titleBeforeVideo}
                          onChange={(event) =>
                            setForm({ ...form, titleBeforeVideo: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="titleHighlight">Highlighted word</Label>
                        <Input
                          id="titleHighlight"
                          value={form.titleHighlight}
                          onChange={(event) =>
                            setForm({ ...form, titleHighlight: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="titleAfterVideo">Title after highlight</Label>
                        <Input
                          id="titleAfterVideo"
                          value={form.titleAfterVideo}
                          onChange={(event) =>
                            setForm({ ...form, titleAfterVideo: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={form.description}
                          onChange={(event) =>
                            setForm({ ...form, description: event.target.value })
                          }
                          className="min-h-24"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ctaText">Primary CTA text</Label>
                        <Input
                          id="ctaText"
                          value={form.ctaText}
                          onChange={(event) =>
                            setForm({ ...form, ctaText: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ctaHref">Primary CTA URL</Label>
                        <Input
                          id="ctaHref"
                          value={form.ctaHref}
                          onChange={(event) =>
                            setForm({ ...form, ctaHref: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="secondaryCtaText">Secondary CTA text</Label>
                        <Input
                          id="secondaryCtaText"
                          value={form.secondaryCtaText}
                          onChange={(event) =>
                            setForm({ ...form, secondaryCtaText: event.target.value })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Links to the WhatsApp channel configured in Top Bar settings.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="mt-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Counter stats</h3>
                        <p className="text-sm text-muted-foreground">
                          Animated numbers shown under the hero description.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setForm({ ...form, stats: [...form.stats, emptyStat()] })
                        }
                      >
                        <Plus className="size-4" />
                        Add stat
                      </Button>
                    </div>
                    {form.stats.map((stat, index) => (
                      <div
                        key={`stat-${index}`}
                        className="grid gap-4 rounded-xl border border-border/70 bg-muted/20 p-4 md:grid-cols-[1fr_1fr_100px_100px_auto]"
                      >
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            value={stat.label}
                            onChange={(event) =>
                              updateStat(index, { label: event.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon class</Label>
                          <Input
                            value={stat.icon}
                            onChange={(event) =>
                              updateStat(index, { icon: event.target.value })
                            }
                            placeholder="icon-trophy"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End value</Label>
                          <Input
                            type="number"
                            value={stat.end}
                            onChange={(event) =>
                              updateStat(index, { end: Number(event.target.value) })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Suffix</Label>
                          <Input
                            value={stat.suffix}
                            onChange={(event) =>
                              updateStat(index, { suffix: event.target.value })
                            }
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setForm({
                                ...form,
                                stats: form.stats.filter((_, i) => i !== index),
                              })
                            }
                            aria-label="Remove stat"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="trust" className="mt-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Trust signals</h3>
                        <p className="text-sm text-muted-foreground">
                          Short credibility chips shown below the CTAs.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setForm({ ...form, trust: [...form.trust, emptyTrust()] })
                        }
                      >
                        <Plus className="size-4" />
                        Add signal
                      </Button>
                    </div>
                    {form.trust.map((item, index) => (
                      <div
                        key={`trust-${index}`}
                        className="grid gap-4 rounded-xl border border-border/70 bg-muted/20 p-4 md:grid-cols-[1fr_1fr_auto]"
                      >
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            value={item.label}
                            onChange={(event) =>
                              updateTrust(index, { label: event.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon class</Label>
                          <Input
                            value={item.icon}
                            onChange={(event) =>
                              updateTrust(index, { icon: event.target.value })
                            }
                            placeholder="icon-satisfaction"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setForm({
                                ...form,
                                trust: form.trust.filter((_, i) => i !== index),
                              })
                            }
                            aria-label="Remove trust signal"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="media" className="mt-6 space-y-6">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="videoId">YouTube video ID</Label>
                        <Input
                          id="videoId"
                          value={form.videoId ?? ""}
                          onChange={(event) =>
                            setForm({ ...form, videoId: event.target.value || null })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activeUserCount">Active users count</Label>
                        <Input
                          id="activeUserCount"
                          type="number"
                          value={form.activeUserCount}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              activeUserCount: Number(event.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activeUserSuffix">Active users suffix</Label>
                        <Input
                          id="activeUserSuffix"
                          value={form.activeUserSuffix}
                          onChange={(event) =>
                            setForm({ ...form, activeUserSuffix: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activeUserLabel">Active users label</Label>
                        <Input
                          id="activeUserLabel"
                          value={form.activeUserLabel}
                          onChange={(event) =>
                            setForm({ ...form, activeUserLabel: event.target.value })
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <ImageField
                      label="Hero image"
                      value={form.heroImageUrl}
                      onChange={(heroImageUrl) => setForm({ ...form, heroImageUrl })}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Active user avatars</h3>
                          <p className="text-sm text-muted-foreground">
                            Optional social-proof avatars via URL or Cloudinary upload.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setForm({
                              ...form,
                              activeUserImages: [...form.activeUserImages, ""],
                            })
                          }
                        >
                          <Plus className="size-4" />
                          Add avatar
                        </Button>
                      </div>
                      {form.activeUserImages.map((image, index) => (
                        <div
                          key={index}
                          className="grid gap-4 rounded-xl border p-4 md:grid-cols-[1fr_auto]"
                        >
                          <ImageField
                            label={`Avatar ${index + 1}`}
                            value={image}
                            onChange={(value) => {
                              const activeUserImages = [...form.activeUserImages];
                              activeUserImages[index] = value;
                              setForm({ ...form, activeUserImages });
                            }}
                          />
                          <div className="flex items-start md:pt-8">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setForm({
                                  ...form,
                                  activeUserImages: form.activeUserImages.filter(
                                    (_, itemIndex) => itemIndex !== index,
                                  ),
                                })
                              }
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end border-t pt-4">
                  <SaveButton loading={saving} />
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
