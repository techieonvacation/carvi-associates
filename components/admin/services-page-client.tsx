"use client";

import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { SaveButton } from "@/components/admin/save-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ServiceItem } from "@/lib/cms/types";

type SectionForm = {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  cardTagline: string;
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

type ServicesPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

export function ServicesPageClient({ user }: ServicesPageProps) {
  const [section, setSection] = useState<SectionForm | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [trash, setTrash] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (trashMode = trash) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (trashMode) params.set("trash", "true");

      const [sectionRes, servicesRes] = await Promise.all([
        fetch("/api/admin/services/section"),
        fetch(`/api/admin/services?${params.toString()}`),
      ]);
      const sectionData = await sectionRes.json();
      const servicesData = await servicesRes.json();

      setSection({
        tagline: sectionData.section.tagline ?? "",
        titleLine1: sectionData.section.titleLine1 ?? "",
        titleLine2: sectionData.section.titleLine2 ?? "",
        cardTagline: sectionData.section.cardTagline ?? "",
        taglineBg: sectionData.section.taglineBg ?? "#fffdf8",
        isVisible: sectionData.section.isVisible ?? true,
        seoTitle: sectionData.section.seoTitle ?? "",
        seoDescription: sectionData.section.seoDescription ?? "",
        seoKeywords: sectionData.section.seoKeywords ?? "",
        canonicalUrl: sectionData.section.canonicalUrl ?? "",
        ogImageUrl: sectionData.section.ogImageUrl ?? "",
        twitterImageUrl: sectionData.section.twitterImageUrl ?? "",
        noIndex: sectionData.section.noIndex ?? false,
      });
      setServices(Array.isArray(servicesData.services) ? servicesData.services : []);
      setSelected(new Set());
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, [trash]);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const [sectionRes, servicesRes] = await Promise.all([
          fetch("/api/admin/services/section"),
          fetch("/api/admin/services"),
        ]);
        const sectionData = await sectionRes.json();
        const servicesData = await servicesRes.json();
        if (!active) return;
        startTransition(() => {
          setSection({
            tagline: sectionData.section.tagline ?? "",
            titleLine1: sectionData.section.titleLine1 ?? "",
            titleLine2: sectionData.section.titleLine2 ?? "",
            cardTagline: sectionData.section.cardTagline ?? "",
            taglineBg: sectionData.section.taglineBg ?? "#fffdf8",
            isVisible: sectionData.section.isVisible ?? true,
            seoTitle: sectionData.section.seoTitle ?? "",
            seoDescription: sectionData.section.seoDescription ?? "",
            seoKeywords: sectionData.section.seoKeywords ?? "",
            canonicalUrl: sectionData.section.canonicalUrl ?? "",
            ogImageUrl: sectionData.section.ogImageUrl ?? "",
            twitterImageUrl: sectionData.section.twitterImageUrl ?? "",
            noIndex: sectionData.section.noIndex ?? false,
          });
          setServices(Array.isArray(servicesData.services) ? servicesData.services : []);
          setLoading(false);
        });
      } catch {
        if (!active) return;
        toast.error("Failed to load services");
        startTransition(() => setLoading(false));
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return services.filter((service) => {
      if (query) {
        const haystack = [
          service.titleLine1,
          service.titleLine2,
          service.description,
          service.slug,
          service.category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (status === "visible" && !service.isVisible) return false;
      if (status === "hidden" && service.isVisible) return false;
      if (status === "active" && !service.isActive) return false;
      if (status === "inactive" && service.isActive) return false;
      if (status === "featured" && !service.isFeatured) return false;
      return true;
    });
  }, [search, services, status]);

  const visibleCount = useMemo(
    () => filteredServices.filter((service) => service.isVisible && !service.deletedAt).length,
    [filteredServices],
  );

  async function saveSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!section) return;
    setSavingSection(true);
    try {
      const response = await fetch("/api/admin/services/section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setSection({
        ...data.section,
        seoTitle: data.section.seoTitle ?? "",
        seoDescription: data.section.seoDescription ?? "",
        seoKeywords: data.section.seoKeywords ?? "",
        canonicalUrl: data.section.canonicalUrl ?? "",
        ogImageUrl: data.section.ogImageUrl ?? "",
        twitterImageUrl: data.section.twitterImageUrl ?? "",
      });
      toast.success("Services section updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingSection(false);
    }
  }

  async function runBulk(action: string) {
    if (!selected.size) {
      toast.error("Select at least one service");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/services/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Bulk action failed");
      toast.success("Bulk action completed");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bulk action failed");
    } finally {
      setBusy(false);
    }
  }

  async function moveService(index: number, direction: -1 | 1) {
    if (trash) return;
    const target = index + direction;
    if (target < 0 || target >= services.length) return;
    const next = [...services];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setServices(next);
    setBusy(true);
    try {
      const response = await fetch("/api/admin/services/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: next.map((service) => service.id) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Reorder failed");
      setServices(data.services);
      toast.success("Order updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reorder failed");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function duplicateService(id: string) {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/services/${id}/duplicate`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Duplicate failed");
      toast.success("Service duplicated");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Duplicate failed");
    } finally {
      setBusy(false);
    }
  }

  async function softDelete(id: string) {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Delete failed");
      toast.success("Moved to trash");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function restoreService(id: string) {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/services/${id}/restore`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Restore failed");
      toast.success("Service restored");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Restore failed");
    } finally {
      setBusy(false);
    }
  }

  async function hardDelete(id: string) {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/services/${id}?hard=true`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Delete failed");
      toast.success("Permanently deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  function toggleSelected(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filteredServices.length) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(filteredServices.map((service) => service.id)));
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Services"
        description="Manage the homepage services grid and each service card."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Section settings</CardTitle>
            <CardDescription>
              Badge, title lines, shared card tagline, visibility, and SEO for the services band.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!section || loading ? (
              <div className="h-48 animate-pulse rounded-xl bg-muted" />
            ) : (
              <form onSubmit={saveSection} className="space-y-6">
                <Tabs defaultValue="general">
                  <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                      <Switch
                        checked={section.isVisible}
                        onCheckedChange={(isVisible) =>
                          setSection((current) => (current ? { ...current, isVisible } : current))
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
                      <Label>Card badge text</Label>
                      <Input
                        value={section.cardTagline}
                        onChange={(event) =>
                          setSection({ ...section, cardTagline: event.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Shared across every service card (matches the live site).
                      </p>
                    </div>
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
                        <Label>Open Graph image URL</Label>
                        <Input
                          value={section.ogImageUrl}
                          onChange={(event) =>
                            setSection({ ...section, ogImageUrl: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Twitter image URL</Label>
                        <Input
                          value={section.twitterImageUrl}
                          onChange={(event) =>
                            setSection({ ...section, twitterImageUrl: event.target.value })
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
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Service cards</CardTitle>
              <CardDescription>
                Search, filter, reorder, bulk publish/hide, duplicate, and soft-delete.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                {visibleCount} visible / {filteredServices.length} shown
              </Badge>
              <Button
                type="button"
                variant={trash ? "default" : "outline"}
                onClick={() => {
                  const next = !trash;
                  setTrash(next);
                  void load(next);
                }}
              >
                <Trash2 className="size-4" />
                {trash ? "Viewing trash" : "Trash"}
              </Button>
              <Button nativeButton={false} render={<Link href="/admin/services/new" />}>
                <Plus className="size-4" />
                New service
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search title, description, slug…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <Select value={status} onValueChange={(value) => value && setStatus(value)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="visible">Visible</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selected.size > 0 ? (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-muted/30 p-3">
                <span className="text-sm font-medium">{selected.size} selected</span>
                {!trash ? (
                  <>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void runBulk("publish")}>
                      Publish
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void runBulk("hide")}>
                      Hide
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void runBulk("show")}>
                      Show
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void runBulk("duplicate")}>
                      Duplicate
                    </Button>
                    <Button size="sm" variant="destructive" disabled={busy} onClick={() => void runBulk("soft-delete")}>
                      Move to trash
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void runBulk("restore")}>
                      Restore
                    </Button>
                    <Button size="sm" variant="destructive" disabled={busy} onClick={() => void runBulk("hard-delete")}>
                      Delete forever
                    </Button>
                  </>
                )}
              </div>
            ) : null}

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        aria-label="Select all"
                        checked={
                          filteredServices.length > 0 &&
                          selected.size === filteredServices.length
                        }
                        onChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead className="w-16">Order</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service, index) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          aria-label={`Select ${service.titleLine1}`}
                          checked={selected.has(service.id)}
                          onChange={() => toggleSelected(service.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {!trash && !search && status === "all" ? (
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              disabled={busy || index === 0}
                              onClick={() => void moveService(index, -1)}
                              aria-label="Move up"
                            >
                              <ArrowUp className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              disabled={busy || index === filteredServices.length - 1}
                              onClick={() => void moveService(index, 1)}
                              aria-label="Move down"
                            >
                              <ArrowDown className="size-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 overflow-hidden rounded-lg border bg-muted">
                            {service.imageUrl ? (
                              <Image
                                src={service.imageUrl}
                                alt={service.imageAlt || service.titleLine1}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {service.titleLine1} {service.titleLine2}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {service.slug ?? "no-slug"} · {service.icon}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant={service.isVisible ? "default" : "secondary"}>
                            {service.isVisible ? "Visible" : "Hidden"}
                          </Badge>
                          <Badge variant={service.isActive ? "outline" : "secondary"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {service.isFeatured ? <Badge variant="secondary">Featured</Badge> : null}
                          {service.isPopular ? <Badge variant="secondary">Popular</Badge> : null}
                          {service.category ? <Badge variant="outline">{service.category}</Badge> : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-full outline-none hover:bg-muted">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Row actions</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!trash ? (
                              <>
                                <DropdownMenuItem
                                  render={<Link href={`/admin/services/${service.id}`} />}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => void duplicateService(service.id)}>
                                  <Copy className="size-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => void softDelete(service.id)}>
                                  <Trash2 className="size-4" />
                                  Move to trash
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <>
                                <DropdownMenuItem onClick={() => void restoreService(service.id)}>
                                  <RotateCcw className="size-4" />
                                  Restore
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => void hardDelete(service.id)}>
                                  <Trash2 className="size-4" />
                                  Delete forever
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem render={<Link href="/" target="_blank" />}>
                              {service.isVisible ? (
                                <>
                                  <Eye className="size-4" />
                                  Preview site
                                </>
                              ) : (
                                <>
                                  <EyeOff className="size-4" />
                                  Preview site
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!filteredServices.length ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        {trash ? "Trash is empty." : "No services found. Create your first card."}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
