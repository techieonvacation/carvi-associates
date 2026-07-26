"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import type {
  FooterLinkColumn,
  FooterNavLink,
  FooterRecentPostItem,
  FooterSocialItem,
} from "@/lib/cms/types";

type SectionForm = {
  about: string;
  backgroundImageUrl: string;
  watermarkText: string;
  showWatermark: boolean;
  copyrightText: string;
  linksTitle: string;
  exploreTitle: string;
  blogTitle: string;
  showAbout: boolean;
  showSocials: boolean;
  showLinks: boolean;
  showExplore: boolean;
  showRecentBlog: boolean;
  showBottomBar: boolean;
  useSiteSocials: boolean;
  logoTone: "light" | "dark";
  isVisible: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  twitterImageUrl: string;
  noIndex: boolean;
};

type FooterPageProps = {
  user: { name: string; email: string; role: "ADMIN" | "MANAGER" };
};

const SOCIAL_ICON_OPTIONS = [
  { value: "fa-facebook-f", label: "Facebook" },
  { value: "fa-twitter", label: "X" },
  { value: "fa-linkedin-in", label: "LinkedIn" },
  { value: "fa-instagram", label: "Instagram" },
];

const COLUMN_LABELS: Record<FooterLinkColumn, string> = {
  LINKS_ONE: "Links column 1",
  LINKS_TWO: "Links column 2",
  EXPLORE: "Explore",
  BOTTOM: "Bottom bar",
};

export function FooterPageClient({ user }: FooterPageProps) {
  const [section, setSection] = useState<SectionForm | null>(null);
  const [links, setLinks] = useState<FooterNavLink[]>([]);
  const [posts, setPosts] = useState<FooterRecentPostItem[]>([]);
  const [socials, setSocials] = useState<FooterSocialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [savingLinks, setSavingLinks] = useState(false);
  const [savingPosts, setSavingPosts] = useState(false);
  const [savingSocials, setSavingSocials] = useState(false);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const [sectionRes, linksRes, postsRes, socialsRes] = await Promise.all([
          fetch("/api/admin/footer"),
          fetch("/api/admin/footer/links"),
          fetch("/api/admin/footer/posts"),
          fetch("/api/admin/footer/socials"),
        ]);
        const sectionData = await sectionRes.json();
        const linksData = await linksRes.json();
        const postsData = await postsRes.json();
        const socialsData = await socialsRes.json();
        if (!active) return;
        startTransition(() => {
          setSection({
            ...sectionData.footer,
            seoTitle: sectionData.footer.seoTitle ?? "",
            seoDescription: sectionData.footer.seoDescription ?? "",
            seoKeywords: sectionData.footer.seoKeywords ?? "",
            canonicalUrl: sectionData.footer.canonicalUrl ?? "",
            ogImageUrl: sectionData.footer.ogImageUrl ?? "",
            twitterImageUrl: sectionData.footer.twitterImageUrl ?? "",
          });
          setLinks(Array.isArray(linksData.links) ? linksData.links : []);
          setPosts(Array.isArray(postsData.posts) ? postsData.posts : []);
          setSocials(Array.isArray(socialsData.socials) ? socialsData.socials : []);
          setLoading(false);
        });
      } catch {
        if (!active) return;
        toast.error("Failed to load Footer CMS");
        startTransition(() => setLoading(false));
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const linksByColumn = useMemo(() => {
    const groups: Record<FooterLinkColumn, FooterNavLink[]> = {
      LINKS_ONE: [],
      LINKS_TWO: [],
      EXPLORE: [],
      BOTTOM: [],
    };
    for (const link of links) groups[link.column].push(link);
    return groups;
  }, [links]);

  function updateLink(id: string, patch: Partial<FooterNavLink>) {
    setLinks((current) =>
      current.map((link) => (link.id === id ? { ...link, ...patch } : link)),
    );
  }

  function addLink(column: FooterLinkColumn) {
    setLinks((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        label: "New link",
        href: "#",
        column,
        displayOrder: current.filter((link) => link.column === column).length,
        isVisible: true,
        isActive: true,
        deletedAt: null,
      },
    ]);
  }

  function removeLink(id: string) {
    setLinks((current) => current.filter((link) => link.id !== id));
  }

  function moveLink(id: string, direction: -1 | 1) {
    setLinks((current) => {
      const link = current.find((item) => item.id === id);
      if (!link) return current;
      const columnLinks = current.filter((item) => item.column === link.column);
      const index = columnLinks.findIndex((item) => item.id === id);
      const target = index + direction;
      if (target < 0 || target >= columnLinks.length) return current;
      const reordered = [...columnLinks];
      const [item] = reordered.splice(index, 1);
      reordered.splice(target, 0, item);
      const others = current.filter((item) => item.column !== link.column);
      return [
        ...others,
        ...reordered.map((row, rowIndex) => ({ ...row, displayOrder: rowIndex })),
      ];
    });
  }

  async function saveSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!section) return;
    setSavingSection(true);
    try {
      const response = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setSection({
        ...data.footer,
        seoTitle: data.footer.seoTitle ?? "",
        seoDescription: data.footer.seoDescription ?? "",
        seoKeywords: data.footer.seoKeywords ?? "",
        canonicalUrl: data.footer.canonicalUrl ?? "",
        ogImageUrl: data.footer.ogImageUrl ?? "",
        twitterImageUrl: data.footer.twitterImageUrl ?? "",
      });
      toast.success("Footer settings updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingSection(false);
    }
  }

  async function saveLinks(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingLinks(true);
    try {
      const response = await fetch("/api/admin/footer/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: links.map((link) => ({
            id:
              link.id.startsWith("new-") || link.id.startsWith("fallback-")
                ? undefined
                : link.id,
            label: link.label,
            href: link.href || "#",
            column: link.column,
            isVisible: link.isVisible,
            isActive: link.isActive,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setLinks(data.links);
      toast.success("Footer links updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingLinks(false);
    }
  }

  async function savePosts(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPosts(true);
    try {
      const response = await fetch("/api/admin/footer/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          posts: posts.map((post, index) => ({
            id:
              post.id.startsWith("new-") || post.id.startsWith("fallback-")
                ? undefined
                : post.id,
            title: post.title,
            dateLabel: post.dateLabel,
            imageUrl: post.imageUrl,
            imageAlt: post.imageAlt,
            href: post.href || "#",
            displayOrder: index,
            isVisible: post.isVisible,
            isActive: post.isActive,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setPosts(data.posts);
      toast.success("Recent blog posts updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingPosts(false);
    }
  }

  async function saveSocials(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingSocials(true);
    try {
      const response = await fetch("/api/admin/footer/socials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socials: socials.map((social, index) => ({
            id:
              social.id.startsWith("new-") || social.id.startsWith("fallback-")
                ? undefined
                : social.id,
            label: social.label,
            href: social.href,
            icon: social.icon,
            displayOrder: index,
            isVisible: social.isVisible,
            isActive: social.isActive,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setSocials(data.socials);
      toast.success("Footer social links updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingSocials(false);
    }
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Footer"
        description="Manage footer about copy, links, explore, recent blog, socials, and options."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Footer settings & options</CardTitle>
            <CardDescription>
              Visibility toggles, titles, background, watermark, copyright, and SEO.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!section || loading ? (
              <div className="h-48 animate-pulse rounded-xl bg-muted" />
            ) : (
              <form onSubmit={saveSection} className="space-y-6">
                <Tabs defaultValue="options">
                  <TabsList className="flex h-auto flex-wrap">
                    <TabsTrigger value="options">Options</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                  </TabsList>
                  <TabsContent value="options" className="mt-4 space-y-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {(
                        [
                          ["isVisible", "Footer visible"],
                          ["showAbout", "Show about column"],
                          ["showSocials", "Show social icons"],
                          ["showLinks", "Show links columns"],
                          ["showExplore", "Show explore column"],
                          ["showRecentBlog", "Show recent blog"],
                          ["showBottomBar", "Show bottom bar"],
                          ["showWatermark", "Show watermark"],
                          ["useSiteSocials", "Use site-wide socials"],
                        ] as const
                      ).map(([key, label]) => (
                        <div
                          key={key}
                          className="flex items-center gap-3 rounded-xl border px-4 py-3"
                        >
                          <Switch
                            checked={section[key]}
                            onCheckedChange={(value) =>
                              setSection({ ...section, [key]: value })
                            }
                          />
                          <Label>{label}</Label>
                        </div>
                      ))}
                    </div>
                    {section.useSiteSocials ? (
                      <p className="text-sm text-muted-foreground">
                        Footer will use social links from{" "}
                        <Link href="/admin/socials" className="text-primary underline">
                          Social Links
                        </Link>
                        . Turn off “Use site-wide socials” to manage footer-only icons below.
                      </p>
                    ) : null}
                  </TabsContent>
                  <TabsContent value="content" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>About text</Label>
                      <Textarea
                        rows={4}
                        value={section.about}
                        onChange={(event) =>
                          setSection({ ...section, about: event.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Links title</Label>
                        <Input
                          value={section.linksTitle}
                          onChange={(event) =>
                            setSection({ ...section, linksTitle: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Explore title</Label>
                        <Input
                          value={section.exploreTitle}
                          onChange={(event) =>
                            setSection({ ...section, exploreTitle: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Blog title</Label>
                        <Input
                          value={section.blogTitle}
                          onChange={(event) =>
                            setSection({ ...section, blogTitle: event.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Copyright text</Label>
                        <Input
                          value={section.copyrightText}
                          onChange={(event) =>
                            setSection({ ...section, copyrightText: event.target.value })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Shown as © Copyright {"{year}"} {section.copyrightText}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Logo tone</Label>
                        <Select
                          value={section.logoTone}
                          onValueChange={(value) => {
                            if (value === "light" || value === "dark") {
                              setSection({ ...section, logoTone: value });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dark">Dark (light logo for olive footer)</SelectItem>
                            <SelectItem value="light">Light (dark logo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Watermark text</Label>
                      <Input
                        value={section.watermarkText}
                        onChange={(event) =>
                          setSection({ ...section, watermarkText: event.target.value })
                        }
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="media" className="mt-4 space-y-4">
                    <ImageField
                      label="Background image"
                      value={section.backgroundImageUrl}
                      onChange={(backgroundImageUrl) =>
                        setSection({ ...section, backgroundImageUrl })
                      }
                    />
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
                    <div className="space-y-2">
                      <Label>Keywords</Label>
                      <Input
                        value={section.seoKeywords}
                        onChange={(event) =>
                          setSection({ ...section, seoKeywords: event.target.value })
                        }
                        placeholder="comma,separated,keywords"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Canonical URL</Label>
                      <Input
                        value={section.canonicalUrl}
                        onChange={(event) =>
                          setSection({ ...section, canonicalUrl: event.target.value })
                        }
                        placeholder="https://"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <ImageField
                        label="OG image"
                        value={section.ogImageUrl}
                        onChange={(ogImageUrl) => setSection({ ...section, ogImageUrl })}
                      />
                      <ImageField
                        label="Twitter image"
                        value={section.twitterImageUrl}
                        onChange={(twitterImageUrl) =>
                          setSection({ ...section, twitterImageUrl })
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
              <CardTitle>Navigation links</CardTitle>
              <CardDescription>
                Manage Links columns, Explore, and bottom-bar links with reorder and visibility.
              </CardDescription>
            </div>
            <Badge variant="secondary">{links.length} links</Badge>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveLinks} className="space-y-6">
              {(Object.keys(COLUMN_LABELS) as FooterLinkColumn[]).map((column) => (
                <div key={column} className="space-y-3 rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium">{COLUMN_LABELS[column]}</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addLink(column)}>
                      <Plus className="size-4" />
                      Add
                    </Button>
                  </div>
                  {linksByColumn[column].map((link, index) => (
                    <div
                      key={link.id}
                      className="grid gap-3 rounded-lg border bg-muted/20 p-3 md:grid-cols-[auto_1fr_1fr_auto]"
                    >
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <GripVertical className="size-4" />
                        <Button type="button" size="sm" variant="ghost" disabled={index === 0} onClick={() => moveLink(link.id, -1)}>
                          Up
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={index === linksByColumn[column].length - 1}
                          onClick={() => moveLink(link.id, 1)}
                        >
                          Down
                        </Button>
                      </div>
                      <Input
                        value={link.label}
                        onChange={(event) => updateLink(link.id, { label: event.target.value })}
                        placeholder="Label"
                      />
                      <Input
                        value={link.href}
                        onChange={(event) => updateLink(link.id, { href: event.target.value })}
                        placeholder="#"
                      />
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={link.isVisible}
                          onCheckedChange={(isVisible) => updateLink(link.id, { isVisible })}
                        />
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeLink(link.id)} aria-label="Remove link">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!linksByColumn[column].length ? (
                    <p className="text-sm text-muted-foreground">No links in this column.</p>
                  ) : null}
                </div>
              ))}
              <div className="flex justify-end">
                <SaveButton loading={savingLinks} label="Save links" />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Recent blog posts</CardTitle>
              <CardDescription>Footer blog teaser cards with image, date, and title.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setPosts((current) => [
                  ...current,
                  {
                    id: `new-${Date.now()}`,
                    title: "New blog post",
                    dateLabel: "1 January 2026",
                    imageUrl: "/images/blog/footer-blog-1-1.jpg",
                    imageAlt: "Blog post",
                    href: "#",
                    displayOrder: current.length,
                    isVisible: true,
                    isActive: true,
                    deletedAt: null,
                  },
                ])
              }
            >
              <Plus className="size-4" />
              Add post
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={savePosts} className="space-y-4">
              {posts.map((post, index) => (
                <div key={post.id} className="space-y-3 rounded-xl border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">#{index + 1}</span>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={post.isVisible}
                        onCheckedChange={(isVisible) =>
                          setPosts((current) =>
                            current.map((row, rowIndex) =>
                              rowIndex === index ? { ...row, isVisible } : row,
                            ),
                          )
                        }
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setPosts((current) => current.filter((_, rowIndex) => rowIndex !== index))
                        }
                        aria-label="Remove post"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      value={post.title}
                      onChange={(event) =>
                        setPosts((current) =>
                          current.map((row, rowIndex) =>
                            rowIndex === index ? { ...row, title: event.target.value } : row,
                          ),
                        )
                      }
                      placeholder="Title"
                    />
                    <Input
                      value={post.dateLabel}
                      onChange={(event) =>
                        setPosts((current) =>
                          current.map((row, rowIndex) =>
                            rowIndex === index ? { ...row, dateLabel: event.target.value } : row,
                          ),
                        )
                      }
                      placeholder="Date label"
                    />
                    <Input
                      value={post.href}
                      onChange={(event) =>
                        setPosts((current) =>
                          current.map((row, rowIndex) =>
                            rowIndex === index ? { ...row, href: event.target.value } : row,
                          ),
                        )
                      }
                      placeholder="Link"
                    />
                    <Input
                      value={post.imageAlt}
                      onChange={(event) =>
                        setPosts((current) =>
                          current.map((row, rowIndex) =>
                            rowIndex === index ? { ...row, imageAlt: event.target.value } : row,
                          ),
                        )
                      }
                      placeholder="Image alt"
                    />
                  </div>
                  <ImageField
                    label="Thumbnail"
                    value={post.imageUrl}
                    onChange={(imageUrl) =>
                      setPosts((current) =>
                        current.map((row, rowIndex) =>
                          rowIndex === index ? { ...row, imageUrl } : row,
                        ),
                      )
                    }
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <SaveButton loading={savingPosts} label="Save posts" />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Footer social media</CardTitle>
              <CardDescription>
                Used when “Use site-wide socials” is off. Otherwise site Social Links are shown.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={!!section?.useSiteSocials}
              onClick={() =>
                setSocials((current) => [
                  ...current,
                  {
                    id: `new-${Date.now()}`,
                    label: "New social",
                    href: "https://",
                    icon: "fa-facebook-f",
                    displayOrder: current.length,
                    isVisible: true,
                    isActive: true,
                    deletedAt: null,
                  },
                ])
              }
            >
              <Plus className="size-4" />
              Add social
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveSocials} className="space-y-4">
              {socials.map((social, index) => (
                <div
                  key={social.id}
                  className="grid gap-3 rounded-xl border bg-muted/20 p-4 md:grid-cols-4"
                >
                  <Input
                    value={social.label}
                    disabled={!!section?.useSiteSocials}
                    onChange={(event) =>
                      setSocials((current) =>
                        current.map((row, rowIndex) =>
                          rowIndex === index ? { ...row, label: event.target.value } : row,
                        ),
                      )
                    }
                    placeholder="Label"
                  />
                  <Input
                    value={social.href}
                    disabled={!!section?.useSiteSocials}
                    onChange={(event) =>
                      setSocials((current) =>
                        current.map((row, rowIndex) =>
                          rowIndex === index ? { ...row, href: event.target.value } : row,
                        ),
                      )
                    }
                    placeholder="URL"
                  />
                  <Select
                    value={social.icon}
                    disabled={!!section?.useSiteSocials}
                    onValueChange={(icon) => {
                      if (!icon) return;
                      setSocials((current) =>
                        current.map((row, rowIndex) =>
                          rowIndex === index ? { ...row, icon } : row,
                        ),
                      );
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOCIAL_ICON_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={social.isVisible}
                      disabled={!!section?.useSiteSocials}
                      onCheckedChange={(isVisible) =>
                        setSocials((current) =>
                          current.map((row, rowIndex) =>
                            rowIndex === index ? { ...row, isVisible } : row,
                          ),
                        )
                      }
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={!!section?.useSiteSocials}
                      onClick={() =>
                        setSocials((current) =>
                          current.filter((_, rowIndex) => rowIndex !== index),
                        )
                      }
                      aria-label="Remove social"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <SaveButton
                  loading={savingSocials}
                  disabled={!!section?.useSiteSocials}
                  label="Save socials"
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
