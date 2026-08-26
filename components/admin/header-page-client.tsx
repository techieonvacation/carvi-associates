"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LOGO_MAX_HEIGHT, LOGO_MIN_HEIGHT } from "@/lib/cms/header-mappers";
import type { LogoVariant } from "@/lib/cms/types";

type HeaderForm = {
  contactCtaText: string;
  contactCtaHref: string;
  showContactCta: boolean;
  showSearch: boolean;
  callTitle: string;
  showCall: boolean;
  showSidebar: boolean;
  sidebarAbout: string;
  sidebarContactTitle: string;
  sidebarNewsletterTitle: string;
  showSidebarNewsletter: boolean;
  logoVariant: LogoVariant;
  logoImageUrl: string;
  logoDarkImageUrl: string;
  logoAlt: string;
  logoHref: string;
  logoMarkText: string;
  logoPrimaryText: string;
  logoSecondaryText: string;
  showLogoMark: boolean;
  logoHeightDesktop: number;
  logoHeightMobile: number;
};

type HeaderPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

function toHeight(value: number | readonly number[]): number {
  return Array.isArray(value) ? value[0] : (value as number);
}

function LogoPreview({ form, tone, height }: { form: HeaderForm; tone: "light" | "dark"; height: number }) {
  const imageSrc = tone === "dark" ? form.logoDarkImageUrl || form.logoImageUrl : form.logoImageUrl;
  const useImage = form.logoVariant === "image" && Boolean(imageSrc);

  return (
    <div
      className={
        tone === "dark"
          ? "flex min-h-28 items-center rounded-xl bg-[#131111] px-5"
          : "flex min-h-28 items-center rounded-xl bg-white px-5"
      }
    >
      {useImage ? (
        <Image
          src={imageSrc}
          alt={form.logoAlt}
          width={480}
          height={160}
          unoptimized
          style={{ height, width: "auto", objectFit: "contain" }}
        />
      ) : (
        <span className="inline-flex items-center" style={{ gap: height * 0.26 }}>
          {form.showLogoMark ? (
            <span
              className="inline-flex shrink-0 items-center justify-center font-bold text-white"
              style={{
                width: height,
                height,
                borderRadius: height * 0.22,
                fontSize: height * 0.55,
                backgroundColor: tone === "dark" ? "#f5c835" : "#006654",
                color: tone === "dark" ? "#131111" : "#ffffff",
              }}
            >
              {form.logoMarkText}
            </span>
          ) : null}
          <span className="flex flex-col" style={{ gap: height * 0.07 }}>
            <span
              className="font-bold leading-none"
              style={{
                fontSize: height * 0.48,
                color: tone === "dark" ? "#ffffff" : "#131111",
              }}
            >
              {form.logoPrimaryText}
            </span>
            {form.logoSecondaryText ? (
              <span
                className="font-semibold uppercase leading-none"
                style={{
                  fontSize: height * 0.24,
                  letterSpacing: "0.22em",
                  color: tone === "dark" ? "#f5c835" : "#006654",
                }}
              >
                {form.logoSecondaryText}
              </span>
            ) : null}
          </span>
        </span>
      )}
    </div>
  );
}

export function HeaderPageClient({ user }: HeaderPageProps) {
  const [form, setForm] = useState<HeaderForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/header");
      const data = await response.json();
      setForm(data.header);
      setLoading(false);
    }
    void load();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setForm(data.header);
      toast.success("Header updated");
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
        title="Header & Logo"
        description="Control the site logo, its size on every screen, and the header call-to-action."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {loading || !form ? (
          <Card className="border-border/70">
            <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-10 animate-pulse rounded-md bg-muted" />
              ))}
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Site logo</CardTitle>
                <CardDescription>
                  Used in the header, the mobile menu and the footer. Upload an image or keep the
                  built-in wordmark, then set how tall it renders on desktop and mobile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Logo type</Label>
                    <Select
                      value={form.logoVariant}
                      onValueChange={(value) =>
                        setForm({ ...form, logoVariant: value as LogoVariant })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wordmark">Wordmark (text)</SelectItem>
                        <SelectItem value="image">Uploaded image</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Image mode falls back to the wordmark until a light logo is uploaded.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoHref">Logo link</Label>
                    <Input
                      id="logoHref"
                      value={form.logoHref}
                      onChange={(event) => setForm({ ...form, logoHref: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="logoAlt">Alt text</Label>
                    <Input
                      id="logoAlt"
                      value={form.logoAlt}
                      onChange={(event) => setForm({ ...form, logoAlt: event.target.value })}
                    />
                  </div>
                </div>

                {form.logoVariant === "image" ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    <ImageField
                      label="Logo for light backgrounds"
                      value={form.logoImageUrl}
                      onChange={(value) => setForm({ ...form, logoImageUrl: value })}
                    />
                    <ImageField
                      label="Logo for dark backgrounds (optional)"
                      value={form.logoDarkImageUrl}
                      onChange={(value) => setForm({ ...form, logoDarkImageUrl: value })}
                    />
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="logoMarkText">Badge letters</Label>
                      <Input
                        id="logoMarkText"
                        maxLength={2}
                        value={form.logoMarkText}
                        onChange={(event) =>
                          setForm({ ...form, logoMarkText: event.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logoPrimaryText">Primary text</Label>
                      <Input
                        id="logoPrimaryText"
                        maxLength={40}
                        value={form.logoPrimaryText}
                        onChange={(event) =>
                          setForm({ ...form, logoPrimaryText: event.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logoSecondaryText">Secondary text</Label>
                      <Input
                        id="logoSecondaryText"
                        maxLength={40}
                        value={form.logoSecondaryText}
                        onChange={(event) =>
                          setForm({ ...form, logoSecondaryText: event.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-3 md:col-span-3">
                      <Switch
                        checked={form.showLogoMark}
                        onCheckedChange={(showLogoMark) => setForm({ ...form, showLogoMark })}
                      />
                      <Label>Show the square badge before the text</Label>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Desktop height</Label>
                      <span className="text-sm font-medium text-muted-foreground">
                        {form.logoHeightDesktop}px
                      </span>
                    </div>
                    <Slider
                      min={LOGO_MIN_HEIGHT}
                      max={LOGO_MAX_HEIGHT}
                      step={1}
                      value={form.logoHeightDesktop}
                      onValueChange={(value) =>
                        setForm({ ...form, logoHeightDesktop: toHeight(value) })
                      }
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Mobile height</Label>
                      <span className="text-sm font-medium text-muted-foreground">
                        {form.logoHeightMobile}px
                      </span>
                    </div>
                    <Slider
                      min={LOGO_MIN_HEIGHT}
                      max={LOGO_MAX_HEIGHT}
                      step={1}
                      value={form.logoHeightMobile}
                      onValueChange={(value) =>
                        setForm({ ...form, logoHeightMobile: toHeight(value) })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Desktop preview</Label>
                    <LogoPreview form={form} tone="light" height={form.logoHeightDesktop} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile preview (dark menu)</Label>
                    <LogoPreview form={form} tone="dark" height={form.logoHeightMobile} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Navigation bar</CardTitle>
                <CardDescription>
                  The call-to-action, search, phone block and sidebar toggle that sit to the
                  right of the menu.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.showContactCta}
                    onCheckedChange={(showContactCta) => setForm({ ...form, showContactCta })}
                  />
                  <Label>Show the call-to-action button</Label>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactCtaText">Button text</Label>
                    <Input
                      id="contactCtaText"
                      maxLength={60}
                      value={form.contactCtaText}
                      onChange={(event) =>
                        setForm({ ...form, contactCtaText: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactCtaHref">Button URL</Label>
                    <Input
                      id="contactCtaHref"
                      value={form.contactCtaHref}
                      onChange={(event) =>
                        setForm({ ...form, contactCtaHref: event.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Use a page URL, or a homepage section such as
                      {" "}
                      <code className="rounded bg-muted px-1 py-0.5">#contact</code> to scroll
                      smoothly.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.showSearch}
                    onCheckedChange={(showSearch) => setForm({ ...form, showSearch })}
                  />
                  <Label>Show the search icon</Label>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.showCall}
                    onCheckedChange={(showCall) => setForm({ ...form, showCall })}
                  />
                  <div>
                    <Label>Show the phone block</Label>
                    <p className="text-xs text-muted-foreground">
                      Uses the phone number from Top Bar, and stays hidden while that field is
                      empty.
                    </p>
                  </div>
                </div>
                <div className="space-y-2 md:max-w-sm">
                  <Label htmlFor="callTitle">Phone block heading</Label>
                  <Input
                    id="callTitle"
                    maxLength={60}
                    value={form.callTitle}
                    onChange={(event) => setForm({ ...form, callTitle: event.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Sidebar panel</CardTitle>
                <CardDescription>
                  The slide-in panel opened by the round toggle at the end of the navigation
                  bar. Contact details and social icons come from Top Bar and Social Links.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.showSidebar}
                    onCheckedChange={(showSidebar) => setForm({ ...form, showSidebar })}
                  />
                  <Label>Show the sidebar toggle</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sidebarAbout">Intro paragraph</Label>
                  <Textarea
                    id="sidebarAbout"
                    rows={3}
                    maxLength={600}
                    value={form.sidebarAbout}
                    onChange={(event) => setForm({ ...form, sidebarAbout: event.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to hide the paragraph.
                  </p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sidebarContactTitle">Contact heading</Label>
                    <Input
                      id="sidebarContactTitle"
                      maxLength={60}
                      value={form.sidebarContactTitle}
                      onChange={(event) =>
                        setForm({ ...form, sidebarContactTitle: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sidebarNewsletterTitle">Newsletter heading</Label>
                    <Input
                      id="sidebarNewsletterTitle"
                      maxLength={60}
                      value={form.sidebarNewsletterTitle}
                      onChange={(event) =>
                        setForm({ ...form, sidebarNewsletterTitle: event.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.showSidebarNewsletter}
                    onCheckedChange={(showSidebarNewsletter) =>
                      setForm({ ...form, showSidebarNewsletter })
                    }
                  />
                  <Label>Show the newsletter subscribe form</Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <SaveButton loading={saving} />
            </div>
          </form>
        )}
      </main>
    </>
  );
}
