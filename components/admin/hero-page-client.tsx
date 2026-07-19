"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type HeroForm = {
  tagline: string;
  titleBeforeVideo: string;
  titleHighlight: string;
  titleAfterVideo: string;
  ctaText: string;
  ctaHref: string;
  videoId: string | null;
  heroImageUrl: string;
  activeUserCount: number;
  activeUserSuffix: string;
  activeUserLabel: string;
  activeUserImages: string[];
};

type HeroPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

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
        activeUserImages: Array.isArray(data.hero.activeUserImages)
          ? data.hero.activeUserImages
          : [],
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
      });
      toast.success("Hero section updated");
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
        title="Hero Section"
        description="Control the homepage hero headline, CTA, video, imagery, and social proof."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Hero content</CardTitle>
            <CardDescription>All fields map directly to the public homepage hero section.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !form ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-10 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={form.tagline}
                      onChange={(event) => setForm({ ...form, tagline: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleBeforeVideo">Title before video</Label>
                    <Input
                      id="titleBeforeVideo"
                      value={form.titleBeforeVideo}
                      onChange={(event) =>
                        setForm({ ...form, titleBeforeVideo: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleHighlight">Highlighted word prefix</Label>
                    <Input
                      id="titleHighlight"
                      value={form.titleHighlight}
                      onChange={(event) =>
                        setForm({ ...form, titleHighlight: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="titleAfterVideo">Title after video</Label>
                    <Input
                      id="titleAfterVideo"
                      value={form.titleAfterVideo}
                      onChange={(event) =>
                        setForm({ ...form, titleAfterVideo: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaText">CTA text</Label>
                    <Input
                      id="ctaText"
                      value={form.ctaText}
                      onChange={(event) => setForm({ ...form, ctaText: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaHref">CTA URL</Label>
                    <Input
                      id="ctaHref"
                      value={form.ctaHref}
                      onChange={(event) => setForm({ ...form, ctaHref: event.target.value })}
                    />
                  </div>
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
                        Add avatar images via URL or Cloudinary upload.
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
                    <div key={index} className="grid gap-4 rounded-xl border p-4 md:grid-cols-[1fr_auto]">
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

                <div className="flex justify-end">
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
