"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

type TopbarForm = {
  email: string;
  address: string;
  addressMapUrl: string;
  phone: string;
  phoneHref: string;
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
        description="Manage the WhatsApp channel notice and the contact details reused across the site."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Top bar content</CardTitle>
            <CardDescription>
              The left band shows a single line of static text: an intro followed by an
              underlined link to your WhatsApp channel. Social links sit on the right, and
              email, phone and address feed the mobile menu and footer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !form ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-10 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={form.showWhatsappNotice}
                      onCheckedChange={(showWhatsappNotice) =>
                        setForm({ ...form, showWhatsappNotice })
                      }
                    />
                    <div>
                      <Label>Show WhatsApp notice</Label>
                      <p className="text-xs text-muted-foreground">
                        The only element rendered in the top bar&apos;s left band.
                      </p>
                    </div>
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
                      <p className="text-xs text-muted-foreground">
                        Plain text shown before the link, e.g. “For more updates follow 👉”.
                      </p>
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
                      <p className="text-xs text-muted-foreground">
                        Underlined and clickable, e.g. “CARVI AND ASSOCIATES on Whatsapp”.
                      </p>
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
                </div>

                <Separator />

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneHref">Phone link</Label>
                    <Input
                      id="phoneHref"
                      value={form.phoneHref}
                      onChange={(event) => setForm({ ...form, phoneHref: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(event) => setForm({ ...form, address: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="addressMapUrl">Address map URL</Label>
                    <Input
                      id="addressMapUrl"
                      value={form.addressMapUrl}
                      onChange={(event) =>
                        setForm({ ...form, addressMapUrl: event.target.value })
                      }
                    />
                  </div>
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
