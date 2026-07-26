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
import type { TeamMemberItem } from "@/lib/cms/types";

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

type TeamPageProps = {
  user: { name: string; email: string; role: "ADMIN" | "MANAGER" };
};

export function TeamPageClient({ user }: TeamPageProps) {
  const [section, setSection] = useState<SectionForm | null>(null);
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [savingMembers, setSavingMembers] = useState(false);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const [sectionRes, membersRes] = await Promise.all([
          fetch("/api/admin/team"),
          fetch("/api/admin/team/members"),
        ]);
        const sectionData = await sectionRes.json();
        const membersData = await membersRes.json();
        if (!active) return;
        startTransition(() => {
          setSection({
            tagline: sectionData.team.tagline ?? "",
            titleLine1: sectionData.team.titleLine1 ?? "",
            titleLine2: sectionData.team.titleLine2 ?? "",
            taglineBg: sectionData.team.taglineBg ?? "#f4ebd8",
            isVisible: sectionData.team.isVisible ?? true,
            seoTitle: sectionData.team.seoTitle ?? "",
            seoDescription: sectionData.team.seoDescription ?? "",
            seoKeywords: sectionData.team.seoKeywords ?? "",
            canonicalUrl: sectionData.team.canonicalUrl ?? "",
            ogImageUrl: sectionData.team.ogImageUrl ?? "",
            twitterImageUrl: sectionData.team.twitterImageUrl ?? "",
            noIndex: sectionData.team.noIndex ?? false,
          });
          setMembers(Array.isArray(membersData.members) ? membersData.members : []);
          setLoading(false);
        });
      } catch {
        if (!active) return;
        toast.error("Failed to load Team section");
        startTransition(() => setLoading(false));
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const visibleCount = useMemo(
    () => members.filter((member) => member.isVisible).length,
    [members],
  );

  function updateMember(index: number, patch: Partial<TeamMemberItem>) {
    setMembers((current) =>
      current.map((member, memberIndex) =>
        memberIndex === index ? { ...member, ...patch } : member,
      ),
    );
  }

  function addMember() {
    setMembers((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        name: "New team member",
        role: "Role",
        imageUrl: "/images/team/team-1-1.png",
        imageAlt: "New team member",
        href: "#",
        socials: [],
        displayOrder: current.length,
        isVisible: true,
        isActive: true,
        deletedAt: null,
      },
    ]);
  }

  function removeMember(index: number) {
    setMembers((current) =>
      current
        .filter((_, memberIndex) => memberIndex !== index)
        .map((member, memberIndex) => ({ ...member, displayOrder: memberIndex })),
    );
  }

  function moveMember(index: number, direction: -1 | 1) {
    setMembers((current) => {
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
      const response = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setSection({
        ...data.team,
        seoTitle: data.team.seoTitle ?? "",
        seoDescription: data.team.seoDescription ?? "",
        seoKeywords: data.team.seoKeywords ?? "",
        canonicalUrl: data.team.canonicalUrl ?? "",
        ogImageUrl: data.team.ogImageUrl ?? "",
        twitterImageUrl: data.team.twitterImageUrl ?? "",
      });
      toast.success("Team section updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingSection(false);
    }
  }

  async function saveMembers(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!members.length) {
      toast.error("Add at least one team member");
      return;
    }
    setSavingMembers(true);
    try {
      const response = await fetch("/api/admin/team/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          members: members.map((member, index) => ({
            id:
              member.id.startsWith("new-") || member.id.startsWith("fallback-")
                ? undefined
                : member.id,
            name: member.name,
            role: member.role,
            imageUrl: member.imageUrl,
            imageAlt: member.imageAlt,
            href: member.href || "#",
            socials: member.socials ?? [],
            displayOrder: index,
            isVisible: member.isVisible,
            isActive: member.isActive,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setMembers(data.members);
      toast.success("Team members updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingMembers(false);
    }
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Team"
        description="Manage the homepage team carousel heading and members."
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
              <CardTitle>Team members</CardTitle>
              <CardDescription>
                Photo, name, role, and profile link. Empty socials fall back to site social links.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {visibleCount} visible / {members.length} total
              </Badge>
              <Button type="button" variant="outline" onClick={addMember} disabled={loading}>
                <Plus className="size-4" />
                Add member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveMembers} className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : (
                members.map((member, index) => (
                  <div
                    key={member.id}
                    className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GripVertical className="size-4" />
                        <span className="text-xs font-medium">#{index + 1}</span>
                        <Button type="button" variant="ghost" size="sm" disabled={index === 0} onClick={() => moveMember(index, -1)}>
                          Up
                        </Button>
                        <Button type="button" variant="ghost" size="sm" disabled={index === members.length - 1} onClick={() => moveMember(index, 1)}>
                          Down
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Switch checked={member.isVisible} onCheckedChange={(isVisible) => updateMember(index, { isVisible })} />
                          <Label>Visible</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={member.isActive} onCheckedChange={(isActive) => updateMember(index, { isActive })} />
                          <Label>Active</Label>
                        </div>
                        <Button type="button" variant="ghost" size="icon" disabled={members.length <= 1} onClick={() => removeMember(index)} aria-label="Remove member">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={member.name} onChange={(event) => updateMember(index, { name: event.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input value={member.role} onChange={(event) => updateMember(index, { role: event.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Profile link</Label>
                        <Input value={member.href} onChange={(event) => updateMember(index, { href: event.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Image alt</Label>
                        <Input value={member.imageAlt} onChange={(event) => updateMember(index, { imageAlt: event.target.value })} />
                      </div>
                    </div>
                    <ImageField
                      label="Member photo"
                      value={member.imageUrl}
                      onChange={(imageUrl) => updateMember(index, { imageUrl })}
                    />
                  </div>
                ))
              )}
              <div className="flex justify-end">
                <SaveButton loading={savingMembers} label="Save members" />
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
