"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { bookAppointmentSchema } from "@/lib/cms/schemas";

type BookAppointmentPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

type FormValues = z.infer<typeof bookAppointmentSchema>;

const emptyValues: FormValues = {
  tagline: "",
  titleLine1: "",
  titleLine2: "",
  description: "",
  primaryButtonText: "Get Started",
  primaryButtonHref: "#",
  secondaryButtonText: "Contact Now",
  secondaryButtonHref: "#",
  backgroundImageUrl: "/images/backgrounds/book-appointment-bg.jpg",
  backgroundImageAlt: "",
  taglineBg: "#f4ebd8",
  isVisible: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  canonicalUrl: "",
  ogImageUrl: "",
  twitterImageUrl: "",
  noIndex: false,
};

export function BookAppointmentPageClient({ user }: BookAppointmentPageProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: emptyValues,
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = form;

  const values = useWatch({ control }) ?? emptyValues;

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/book-appointment");
      const data = await response.json();
      const row = data.bookAppointment;
      reset({
        tagline: row.tagline ?? "",
        titleLine1: row.titleLine1 ?? "",
        titleLine2: row.titleLine2 ?? "",
        description: row.description ?? "",
        primaryButtonText: row.primaryButtonText ?? "Get Started",
        primaryButtonHref: row.primaryButtonHref ?? "#",
        secondaryButtonText: row.secondaryButtonText ?? "Contact Now",
        secondaryButtonHref: row.secondaryButtonHref ?? "#",
        backgroundImageUrl: row.backgroundImageUrl ?? "",
        backgroundImageAlt: row.backgroundImageAlt ?? "",
        taglineBg: row.taglineBg ?? "#f4ebd8",
        isVisible: row.isVisible ?? true,
        seoTitle: row.seoTitle ?? "",
        seoDescription: row.seoDescription ?? "",
        seoKeywords: row.seoKeywords ?? "",
        canonicalUrl: row.canonicalUrl ?? "",
        ogImageUrl: row.ogImageUrl ?? "",
        twitterImageUrl: row.twitterImageUrl ?? "",
        noIndex: row.noIndex ?? false,
      });
      setLoading(false);
    }
    void load();
  }, [reset]);

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  async function onSubmit(data: FormValues) {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/book-appointment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Save failed");
      const row = result.bookAppointment;
      reset({
        ...row,
        seoTitle: row.seoTitle ?? "",
        seoDescription: row.seoDescription ?? "",
        seoKeywords: row.seoKeywords ?? "",
        canonicalUrl: row.canonicalUrl ?? "",
        ogImageUrl: row.ogImageUrl ?? "",
        twitterImageUrl: row.twitterImageUrl ?? "",
      });
      toast.success("Book Appointment section updated");
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
        title="Book Appointment"
        description="Edit the dark CTA band between Services and Why Choose Us."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {loading ? (
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <Badge variant={values.isVisible ? "default" : "secondary"}>
                  {values.isVisible ? "Visible" : "Hidden"}
                </Badge>
                {isDirty ? <Badge variant="outline">Unsaved changes</Badge> : null}
              </div>
              <SaveButton loading={saving} disabled={!isDirty} />
            </div>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>CTA section editor</CardTitle>
                <CardDescription>
                  General copy, buttons, background image, decorations context, and SEO.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general">
                  <TabsList className="flex h-auto flex-wrap">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="buttons">Buttons</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="background">Background</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="mt-4 space-y-4">
                    <Controller
                      control={control}
                      name="isVisible"
                      render={({ field }) => (
                        <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                          <div>
                            <Label>Section visible</Label>
                            <p className="text-xs text-muted-foreground">
                              Corner shapes and overlay remain presentation-only.
                            </p>
                          </div>
                        </div>
                      )}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Badge / tagline</Label>
                        <Input {...register("tagline")} />
                        {errors.tagline ? (
                          <p className="text-xs text-destructive">{errors.tagline.message}</p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <Label>Tagline background</Label>
                        <Input {...register("taglineBg")} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Title line 1</Label>
                        <Input {...register("titleLine1")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Title line 2</Label>
                        <Input {...register("titleLine2")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea rows={4} {...register("description")} />
                    </div>
                  </TabsContent>

                  <TabsContent value="buttons" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Primary button text</Label>
                        <Input {...register("primaryButtonText")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary button URL</Label>
                        <Input {...register("primaryButtonHref")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary button text</Label>
                        <Input {...register("secondaryButtonText")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary button URL</Label>
                        <Input {...register("secondaryButtonHref")} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="mt-4 space-y-4">
                    <Controller
                      control={control}
                      name="backgroundImageUrl"
                      render={({ field }) => (
                        <ImageField
                          label="Background image"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <div className="space-y-2">
                      <Label>Background image alt</Label>
                      <Input {...register("backgroundImageAlt")} />
                    </div>
                  </TabsContent>

                  <TabsContent value="background" className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <p>
                      Decorative corner shapes and the green brand overlay are structural design
                      tokens managed in CSS so the public section stays visually identical.
                    </p>
                    <p>
                      Content managers control the photograph, copy, buttons, tagline color, and
                      visibility from this editor.
                    </p>
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
                      <div className="space-y-2">
                        <Label>Twitter image</Label>
                        <Input {...register("twitterImageUrl")} />
                      </div>
                      <Controller
                        control={control}
                        name="noIndex"
                        render={({ field }) => (
                          <div className="flex items-center gap-3 self-end rounded-xl border px-4 py-3">
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                            <Label>NoIndex</Label>
                          </div>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="mt-4">
                    <div
                      className="relative overflow-hidden rounded-2xl px-6 py-16 text-center text-white"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,102,84,0.93), rgba(0,102,84,0.93)), url(${values.backgroundImageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <p className="mb-3 text-sm uppercase tracking-wide opacity-90">
                        {values.tagline}
                      </p>
                      <h3 className="mb-4 text-2xl font-bold md:text-3xl">
                        {values.titleLine1}
                        <br />
                        {values.titleLine2}
                      </h3>
                      <p className="mx-auto mb-6 max-w-2xl text-sm opacity-90">
                        {values.description}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground">
                          {values.primaryButtonText}
                        </span>
                        <span className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
                          {values.secondaryButtonText}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </form>
        )}
      </main>
    </>
  );
}
