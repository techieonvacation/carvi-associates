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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { WorkingProcessStepItem } from "@/lib/cms/types";

type SectionForm = {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  taglineBg: string;
  isVisible: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  twitterImageUrl: string;
  noIndex: boolean;
};

type WorkingProcessPageProps = {
  user: { name: string; email: string; role: "ADMIN" | "MANAGER" };
};

export function WorkingProcessPageClient({ user }: WorkingProcessPageProps) {
  const [section, setSection] = useState<SectionForm | null>(null);
  const [steps, setSteps] = useState<WorkingProcessStepItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [savingSteps, setSavingSteps] = useState(false);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const [sectionRes, stepsRes] = await Promise.all([
          fetch("/api/admin/working-process"),
          fetch("/api/admin/working-process/steps"),
        ]);
        const sectionData = await sectionRes.json();
        const stepsData = await stepsRes.json();
        if (!active) return;
        startTransition(() => {
          setSection({
            tagline: sectionData.workingProcess.tagline ?? "",
            titleLine1: sectionData.workingProcess.titleLine1 ?? "",
            titleLine2: sectionData.workingProcess.titleLine2 ?? "",
            taglineBg: sectionData.workingProcess.taglineBg ?? "#f4ebd8",
            isVisible: sectionData.workingProcess.isVisible ?? true,
            seoTitle: sectionData.workingProcess.seoTitle ?? "",
            seoDescription: sectionData.workingProcess.seoDescription ?? "",
            seoKeywords: sectionData.workingProcess.seoKeywords ?? "",
            canonicalUrl: sectionData.workingProcess.canonicalUrl ?? "",
            ogImageUrl: sectionData.workingProcess.ogImageUrl ?? "",
            twitterImageUrl: sectionData.workingProcess.twitterImageUrl ?? "",
            noIndex: sectionData.workingProcess.noIndex ?? false,
          });
          setSteps(Array.isArray(stepsData.steps) ? stepsData.steps : []);
          setLoading(false);
        });
      } catch {
        if (!active) return;
        toast.error("Failed to load Working Process");
        startTransition(() => setLoading(false));
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const visibleCount = useMemo(
    () => steps.filter((step) => step.isVisible).length,
    [steps],
  );

  function updateStep(index: number, patch: Partial<WorkingProcessStepItem>) {
    setSteps((current) =>
      current.map((step, stepIndex) =>
        stepIndex === index ? { ...step, ...patch } : step,
      ),
    );
  }

  function addStep() {
    setSteps((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        stepLabel: `Step ${String(current.length + 1).padStart(2, "0")}`,
        title: "New step",
        text: "Describe this process step.",
        imageUrl: "/images/resources/working-process-1-1.jpg",
        imageAlt: "New step",
        href: "#",
        displayOrder: current.length,
        isVisible: true,
        isActive: true,
        deletedAt: null,
      },
    ]);
  }

  function removeStep(index: number) {
    setSteps((current) =>
      current
        .filter((_, stepIndex) => stepIndex !== index)
        .map((step, stepIndex) => ({ ...step, displayOrder: stepIndex })),
    );
  }

  function moveStep(index: number, direction: -1 | 1) {
    setSteps((current) => {
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
      const response = await fetch("/api/admin/working-process", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setSection({
        ...data.workingProcess,
        seoTitle: data.workingProcess.seoTitle ?? "",
        seoDescription: data.workingProcess.seoDescription ?? "",
        seoKeywords: data.workingProcess.seoKeywords ?? "",
        canonicalUrl: data.workingProcess.canonicalUrl ?? "",
        ogImageUrl: data.workingProcess.ogImageUrl ?? "",
        twitterImageUrl: data.workingProcess.twitterImageUrl ?? "",
      });
      toast.success("Working Process section updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingSection(false);
    }
  }

  async function saveSteps(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!steps.length) {
      toast.error("Add at least one step");
      return;
    }
    setSavingSteps(true);
    try {
      const response = await fetch("/api/admin/working-process/steps", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          steps: steps.map((step, index) => ({
            id:
              step.id.startsWith("new-") || step.id.startsWith("fallback-")
                ? undefined
                : step.id,
            stepLabel: step.stepLabel,
            title: step.title,
            text: step.text,
            imageUrl: step.imageUrl,
            imageAlt: step.imageAlt,
            href: step.href || "#",
            displayOrder: index,
            isVisible: step.isVisible,
            isActive: step.isActive,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setSteps(data.steps);
      toast.success("Working Process steps updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingSteps(false);
    }
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Working Process"
        description="Manage the zig-zag process timeline heading and steps."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Section settings</CardTitle>
            <CardDescription>Badge, title lines, visibility, and SEO.</CardDescription>
          </CardHeader>
          <CardContent>
            {!section || loading ? (
              <div className="h-40 animate-pulse rounded-xl bg-muted" />
            ) : (
              <form onSubmit={saveSection} className="space-y-6">
                <Tabs defaultValue="general">
                  <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                      <Switch
                        checked={section.isVisible}
                        onCheckedChange={(isVisible) => setSection({ ...section, isVisible })}
                      />
                      <Label>Section visible</Label>
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
                  </TabsContent>
                  <TabsContent value="seo" className="mt-4 space-y-4">
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
                      <Label>Meta description</Label>
                      <Textarea
                        rows={3}
                        value={section.seoDescription}
                        onChange={(event) =>
                          setSection({ ...section, seoDescription: event.target.value })
                        }
                      />
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
              <CardTitle>Process steps</CardTitle>
              <CardDescription>
                Step badge, title, copy, image, and CTA link. Order drives the zig-zag layout.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {visibleCount} visible / {steps.length} total
              </Badge>
              <Button type="button" variant="outline" onClick={addStep} disabled={loading}>
                <Plus className="size-4" />
                Add step
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveSteps} className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : (
                steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GripVertical className="size-4" />
                        <span className="text-xs font-medium">#{index + 1}</span>
                        <Button type="button" variant="ghost" size="sm" disabled={index === 0} onClick={() => moveStep(index, -1)}>
                          Up
                        </Button>
                        <Button type="button" variant="ghost" size="sm" disabled={index === steps.length - 1} onClick={() => moveStep(index, 1)}>
                          Down
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Switch checked={step.isVisible} onCheckedChange={(isVisible) => updateStep(index, { isVisible })} />
                          <Label>Visible</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={step.isActive} onCheckedChange={(isActive) => updateStep(index, { isActive })} />
                          <Label>Active</Label>
                        </div>
                        <Button type="button" variant="ghost" size="icon" disabled={steps.length <= 1} onClick={() => removeStep(index)} aria-label="Remove step">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Step label</Label>
                        <Input value={step.stepLabel} onChange={(event) => updateStep(index, { stepLabel: event.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={step.title} onChange={(event) => updateStep(index, { title: event.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Link</Label>
                        <Input value={step.href} onChange={(event) => updateStep(index, { href: event.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Image alt</Label>
                        <Input value={step.imageAlt} onChange={(event) => updateStep(index, { imageAlt: event.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea rows={2} value={step.text} onChange={(event) => updateStep(index, { text: event.target.value })} />
                    </div>
                    <ImageField
                      label="Step image"
                      value={step.imageUrl}
                      onChange={(imageUrl) => updateStep(index, { imageUrl })}
                    />
                  </div>
                ))
              )}
              <div className="flex justify-end">
                <SaveButton loading={savingSteps} label="Save steps" />
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
