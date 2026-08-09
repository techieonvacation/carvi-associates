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
import { Textarea } from "@/components/ui/textarea";

type TopbarForm = {
  email: string;
  address: string;
  addressMapUrl: string;
  phone: string;
  phoneHref: string;
  whatsappLabel: string;
  whatsappHref: string;
  whatsappMarqueeText: string;
  whatsappMarqueeSpeed: number;
  showWhatsappMarquee: boolean;
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
        description="Manage the WhatsApp channel strip and the contact details reused across the site."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Top bar content</CardTitle>
            <CardDescription>
              The left band shows only the scrolling WhatsApp channel invite; social links sit
              on the right. Email, phone and address feed the mobile menu and footer.
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
                      checked={form.showWhatsappMarquee}
                      onCheckedChange={(showWhatsappMarquee) =>
                        setForm({ ...form, showWhatsappMarquee })
                      }
                    />
                    <div>
                      <Label>Show WhatsApp channel marquee</Label>
                      <p className="text-xs text-muted-foreground">
                        The only element rendered in the top bar&apos;s left band.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappMarqueeText">Scrolling message</Label>
                    <Textarea
                      id="whatsappMarqueeText"
                      rows={2}
                      maxLength={180}
                      value={form.whatsappMarqueeText}
                      onChange={(event) =>
                        setForm({ ...form, whatsappMarqueeText: event.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Repeats seamlessly inside the left band. Around 60–90 characters reads best.
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-3">
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
                      <Label htmlFor="whatsappMarqueeSpeed">Loop duration (seconds)</Label>
                      <Input
                        id="whatsappMarqueeSpeed"
                        type="number"
                        min={5}
                        max={120}
                        value={form.whatsappMarqueeSpeed}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            whatsappMarqueeSpeed: Number(event.target.value),
                          })
                        }
                      />
                    </div>
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
