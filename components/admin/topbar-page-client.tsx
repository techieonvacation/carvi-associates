"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type TopbarForm = {
  email: string;
  address: string;
  addressMapUrl: string;
  phone: string;
  phoneHref: string;
  openHours: string;
  noteLabel: string;
  noteText: string;
  showNote: boolean;
  socialsTitle: string;
  showSocials: boolean;
  whatsappLabel: string;
  whatsappHref: string;
  whatsappIntroText: string;
  whatsappLinkText: string;
  showWhatsappNotice: boolean;
};

type TopbarPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

const HIDE_WHEN_EMPTY = "Leave empty to hide this item from the top bar.";

export function TopbarPageClient({ user }: TopbarPageProps) {
  const [form, setForm] = useState<TopbarForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/topbar");
      const data = await response.json();
      setForm(data.topbar);
      setLoading(false);
    }
    void load();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/topbar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setForm(data.topbar);
      toast.success("Top bar updated");
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
        title="Top Bar"
        description="Manage the note strip, the WhatsApp channel notice and the contact details reused across the site."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {loading || !form ? (
          <Card className="border-border/70">
            <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-10 animate-pulse rounded-md bg-muted" />
              ))}
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Note strip</CardTitle>
                <CardDescription>
                  The yellow rotated badge and the sentence beside it, at the far left of the
                  top bar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.showNote}
                    onCheckedChange={(showNote) => setForm({ ...form, showNote })}
                  />
                  <Label>Show the note strip</Label>
                </div>
                <div className="grid gap-5 md:grid-cols-[200px_1fr]">
                  <div className="space-y-2">
                    <Label htmlFor="noteLabel">Badge text</Label>
                    <Input
                      id="noteLabel"
                      maxLength={24}
                      value={form.noteLabel}
                      onChange={(event) => setForm({ ...form, noteLabel: event.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Rendered vertically inside the yellow badge.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="noteText">Note text</Label>
                    <Input
                      id="noteText"
                      maxLength={120}
                      value={form.noteText}
                      onChange={(event) => setForm({ ...form, noteText: event.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">{HIDE_WHEN_EMPTY}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>WhatsApp notice</CardTitle>
                <CardDescription>
                  An intro line followed by an underlined link to your WhatsApp channel, shown
                  next to the note strip.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.showWhatsappNotice}
                    onCheckedChange={(showWhatsappNotice) =>
                      setForm({ ...form, showWhatsappNotice })
                    }
                  />
                  <Label>Show WhatsApp notice</Label>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="whatsappIntroText">Intro text</Label>
                    <Input
                      id="whatsappIntroText"
                      maxLength={120}
                      value={form.whatsappIntroText}
                      onChange={(event) =>
                        setForm({ ...form, whatsappIntroText: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappLinkText">Link text</Label>
                    <Input
                      id="whatsappLinkText"
                      maxLength={120}
                      value={form.whatsappLinkText}
                      onChange={(event) =>
                        setForm({ ...form, whatsappLinkText: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappHref">WhatsApp channel URL</Label>
                    <Input
                      id="whatsappHref"
                      value={form.whatsappHref}
                      onChange={(event) =>
                        setForm({ ...form, whatsappHref: event.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">{HIDE_WHEN_EMPTY}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappLabel">Accessible link label</Label>
                    <Input
                      id="whatsappLabel"
                      value={form.whatsappLabel}
                      onChange={(event) =>
                        setForm({ ...form, whatsappLabel: event.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <p className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border/70 bg-background px-3 py-2 text-sm">
                    <span>{form.whatsappIntroText}</span>
                    <span className="font-semibold underline underline-offset-4">
                      {form.whatsappLinkText}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Contact details</CardTitle>
                <CardDescription>
                  Shown on the right of the top bar, and reused by the header call block, the
                  mobile menu and the sidebar. Every field here is optional — an empty field is
                  hidden everywhere instead of rendering a blank row.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="openHours">Opening hours</Label>
                  <Input
                    id="openHours"
                    maxLength={80}
                    placeholder="Open Hours of (8.00 am - 6.00 pm)"
                    value={form.openHours}
                    onChange={(event) => setForm({ ...form, openHours: event.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">{HIDE_WHEN_EMPTY}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">{HIDE_WHEN_EMPTY}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Also drives the “Get Contact Now” block in the header. {HIDE_WHEN_EMPTY}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneHref">Phone link</Label>
                  <Input
                    id="phoneHref"
                    placeholder="tel:+919999999999"
                    value={form.phoneHref}
                    onChange={(event) => setForm({ ...form, phoneHref: event.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to build a <code className="rounded bg-muted px-1 py-0.5">tel:</code>{" "}
                    link from the phone number.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    maxLength={200}
                    value={form.address}
                    onChange={(event) => setForm({ ...form, address: event.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">{HIDE_WHEN_EMPTY}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressMapUrl">Address map URL</Label>
                  <Input
                    id="addressMapUrl"
                    value={form.addressMapUrl}
                    onChange={(event) =>
                      setForm({ ...form, addressMapUrl: event.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to show the address as plain text.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Social strip</CardTitle>
                <CardDescription>
                  The green band on the right of the top bar. The icons themselves are managed
                  under Social Links.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.showSocials}
                    onCheckedChange={(showSocials) => setForm({ ...form, showSocials })}
                  />
                  <Label>Show the social strip</Label>
                </div>
                <div className="space-y-2 md:max-w-sm">
                  <Label htmlFor="socialsTitle">Strip label</Label>
                  <Input
                    id="socialsTitle"
                    maxLength={40}
                    value={form.socialsTitle}
                    onChange={(event) =>
                      setForm({ ...form, socialsTitle: event.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to show only the icons.
                  </p>
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
