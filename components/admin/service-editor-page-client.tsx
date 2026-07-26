"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { serviceItemSchema } from "@/lib/cms/schemas";
import { FEATURE_ICON_OPTIONS, SERVICE_ICON_TYPES } from "@/lib/cms/types";
import { slugify } from "@/lib/cms/service-mappers";

type ServiceEditorPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
  serviceId?: string;
};

type ServiceFormValues = z.infer<typeof serviceItemSchema>;

const emptyValues: ServiceFormValues = {
  titleLine1: "",
  titleLine2: "",
  shortTitle: "",
  subtitle: "",
  description: "",
  slug: "",
  icon: "icon-stats-2",
  iconType: "icomoon",
  imageUrl: "/images/services/service-1-1.jpg",
  imageAlt: "",
  hoverImageUrl: "",
  badge: "",
  category: "",
  serviceType: "",
  accentColor: "",
  ctaText: "Learn more",
  ctaHref: "#",
  isFeatured: false,
  isPopular: false,
  isActive: true,
  isVisible: true,
  publishedAt: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  canonicalUrl: "",
  ogImageUrl: "",
  noIndex: false,
};

function toFormValues(service: Record<string, unknown>): ServiceFormValues {
  return {
    ...emptyValues,
    titleLine1: String(service.titleLine1 ?? ""),
    titleLine2: String(service.titleLine2 ?? ""),
    shortTitle: String(service.shortTitle ?? ""),
    subtitle: String(service.subtitle ?? ""),
    description: String(service.description ?? ""),
    slug: String(service.slug ?? ""),
    icon: String(service.icon ?? "icon-stats-2"),
    iconType: (service.iconType as ServiceFormValues["iconType"]) ?? "icomoon",
    imageUrl: String(service.imageUrl ?? ""),
    imageAlt: String(service.imageAlt ?? ""),
    hoverImageUrl: String(service.hoverImageUrl ?? ""),
    badge: String(service.badge ?? ""),
    category: String(service.category ?? ""),
    serviceType: String(service.serviceType ?? ""),
    accentColor: String(service.accentColor ?? ""),
    ctaText: String(service.ctaText ?? "Learn more"),
    ctaHref: String(service.ctaHref ?? "#"),
    isFeatured: Boolean(service.isFeatured),
    isPopular: Boolean(service.isPopular),
    isActive: Boolean(service.isActive ?? true),
    isVisible: Boolean(service.isVisible ?? true),
    publishedAt: service.publishedAt ? String(service.publishedAt) : "",
    seoTitle: String(service.seoTitle ?? ""),
    seoDescription: String(service.seoDescription ?? ""),
    seoKeywords: String(service.seoKeywords ?? ""),
    canonicalUrl: String(service.canonicalUrl ?? ""),
    ogImageUrl: String(service.ogImageUrl ?? ""),
    noIndex: Boolean(service.noIndex),
  };
}

export function ServiceEditorPageClient({ user, serviceId }: ServiceEditorPageProps) {
  const router = useRouter();
  const isCreate = !serviceId;
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceItemSchema),
    defaultValues: emptyValues,
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, errors },
  } = form;

  const values = useWatch({ control }) ?? emptyValues;

  useEffect(() => {
    if (isCreate) return;
    async function load() {
      const response = await fetch(`/api/admin/services/${serviceId}`);
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error ?? "Failed to load service");
        router.push("/admin/services");
        return;
      }
      reset(toFormValues(data.service));
      setLoading(false);
    }
    void load();
  }, [isCreate, reset, router, serviceId]);

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const previewTitle = useMemo(
    () => `${values.titleLine1 || "Service"} ${values.titleLine2 || ""}`.trim(),
    [values.titleLine1, values.titleLine2],
  );

  async function onSubmit(data: ServiceFormValues) {
    setSaving(true);
    try {
      const response = await fetch(
        isCreate ? "/api/admin/services" : `/api/admin/services/${serviceId}`,
        {
          method: isCreate ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Save failed");
      toast.success(isCreate ? "Service created" : "Service updated");
      reset(toFormValues(result.service));
      if (isCreate) {
        router.push(`/admin/services/${result.service.id}`);
      }
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
        title={isCreate ? "New service" : "Edit service"}
        description="Configure content, media, CTAs, SEO, and visibility for a service card."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {loading ? (
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{isCreate ? "Draft create" : "Editing"}</Badge>
                {isDirty ? <Badge variant="outline">Unsaved changes</Badge> : null}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
                    router.push("/admin/services");
                  }}
                >
                  Back to list
                </Button>
                <SaveButton loading={saving} disabled={!isDirty && !isCreate} />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>{previewTitle}</CardTitle>
                  <CardDescription>
                    Tabs keep the editor organized for content managers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="general">
                    <TabsList className="flex h-auto flex-wrap">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="images">Images</TabsTrigger>
                      <TabsTrigger value="buttons">Buttons</TabsTrigger>
                      <TabsTrigger value="seo">SEO</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="mt-4 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Title line 1</Label>
                          <Input {...register("titleLine1")} />
                          {errors.titleLine1 ? (
                            <p className="text-xs text-destructive">{errors.titleLine1.message}</p>
                          ) : null}
                        </div>
                        <div className="space-y-2">
                          <Label>Title line 2</Label>
                          <Input {...register("titleLine2")} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Short title</Label>
                          <Input {...register("shortTitle")} />
                        </div>
                        <div className="space-y-2">
                          <Label>Slug</Label>
                          <div className="flex gap-2">
                            <Input {...register("slug")} placeholder="auto-generated" />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                setValue(
                                  "slug",
                                  slugify(`${values.titleLine1} ${values.titleLine2}`),
                                  { shouldDirty: true },
                                )
                              }
                            >
                              Generate
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input {...register("subtitle")} />
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input {...register("category")} />
                        </div>
                        <div className="space-y-2">
                          <Label>Service type</Label>
                          <Input {...register("serviceType")} />
                        </div>
                        <div className="space-y-2">
                          <Label>Badge</Label>
                          <Input {...register("badge")} />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="content" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea rows={4} {...register("description")} />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Icon type</Label>
                          <Controller
                            control={control}
                            name="iconType"
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={(value) => {
                                  if (value) field.onChange(value);
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {SERVICE_ICON_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Controller
                            control={control}
                            name="icon"
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={(value) => {
                                  if (value) field.onChange(value);
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
                                    field.value as (typeof FEATURE_ICON_OPTIONS)[number],
                                  ) ? (
                                    <SelectItem value={field.value}>{field.value}</SelectItem>
                                  ) : null}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Accent color</Label>
                        <Input {...register("accentColor")} placeholder="#cdae7c" />
                      </div>
                    </TabsContent>

                    <TabsContent value="images" className="mt-4 space-y-4">
                      <Controller
                        control={control}
                        name="imageUrl"
                        render={({ field }) => (
                          <ImageField
                            label="Featured / hover image"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <div className="space-y-2">
                        <Label>Image alt text</Label>
                        <Input {...register("imageAlt")} />
                      </div>
                      <Controller
                        control={control}
                        name="hoverImageUrl"
                        render={({ field }) => (
                          <ImageField
                            label="Optional alternate hover image"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="buttons" className="mt-4 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>CTA text</Label>
                          <Input {...register("ctaText")} />
                        </div>
                        <div className="space-y-2">
                          <Label>CTA link</Label>
                          <Input {...register("ctaHref")} />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="seo" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label>SEO title</Label>
                        <Input {...register("seoTitle")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Meta description</Label>
                        <Textarea rows={3} {...register("seoDescription")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Keywords</Label>
                        <Input {...register("seoKeywords")} />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Canonical URL</Label>
                          <Input {...register("canonicalUrl")} />
                        </div>
                        <div className="space-y-2">
                          <Label>Open Graph image</Label>
                          <Input {...register("ogImageUrl")} />
                        </div>
                      </div>
                      <Controller
                        control={control}
                        name="noIndex"
                        render={({ field }) => (
                          <div className="flex items-center gap-3">
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                            <Label>NoIndex</Label>
                          </div>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="settings" className="mt-4 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Controller
                          control={control}
                          name="isVisible"
                          render={({ field }) => (
                            <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                              <Label>Visible on site</Label>
                            </div>
                          )}
                        />
                        <Controller
                          control={control}
                          name="isActive"
                          render={({ field }) => (
                            <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                              <Label>Active / published</Label>
                            </div>
                          )}
                        />
                        <Controller
                          control={control}
                          name="isFeatured"
                          render={({ field }) => (
                            <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                              <Label>Featured</Label>
                            </div>
                          )}
                        />
                        <Controller
                          control={control}
                          name="isPopular"
                          render={({ field }) => (
                            <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                              <Label>Popular</Label>
                            </div>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="preview" className="mt-4">
                      <div className="rounded-2xl border bg-secondary/40 p-6">
                        <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                          Card preview
                        </p>
                        <div className="max-w-sm rounded-[20px] bg-white p-8 shadow-sm">
                          <p className="mb-3 text-sm text-muted-foreground">Finance Strategic Business</p>
                          <h3 className="mb-2 text-xl font-bold capitalize">
                            {values.titleLine1}
                            <br />
                            {values.titleLine2}
                          </h3>
                          <p className="mb-6 text-sm text-muted-foreground">{values.description}</p>
                          <div className="flex items-center gap-6">
                            <span className="text-[48px] text-accent">
                              <i className={values.icon} aria-hidden="true" />
                            </span>
                            <span className="text-2xl font-semibold text-muted-foreground">01</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="h-fit border-border/70">
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                  <CardDescription>Quick status and media summary.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={values.isVisible ? "default" : "secondary"}>
                      {values.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                    <Badge variant={values.isActive ? "outline" : "secondary"}>
                      {values.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {values.isFeatured ? <Badge variant="secondary">Featured</Badge> : null}
                    {values.isPopular ? <Badge variant="secondary">Popular</Badge> : null}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">CTA</p>
                    <p className="text-muted-foreground">
                      {values.ctaText} → {values.ctaHref}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Image</p>
                    <p className="break-all text-muted-foreground">{values.imageUrl || "—"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
