"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type ContactForm = {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  taglineBg: string;
  phoneTitle: string;
  phoneText: string;
  phoneHref: string;
  showPhone: boolean;
  emailTitle: string;
  emailText: string;
  showEmail: boolean;
  locationTitle: string;
  locationText: string;
  locationUrl: string;
  showLocation: boolean;
  nameLabel: string;
  companyLabel: string;
  emailLabel: string;
  mobileLabel: string;
  locationLabel: string;
  submitLabel: string;
  sideImageUrl: string;
  sideImageAlt: string;
  showSideImage: boolean;
  showShape: boolean;
  isVisible: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  twitterImageUrl: string;
  noIndex: boolean;
};

type ContactPageProps = {
  user: { name: string; email: string; role: "ADMIN" | "MANAGER" };
};

export function ContactPageClient({ user }: ContactPageProps) {
  const [form, setForm] = useState<ContactForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/admin/contact");
        const data = await response.json();
        setForm({
          ...data.contact,
          seoTitle: data.contact.seoTitle ?? "",
          seoDescription: data.contact.seoDescription ?? "",
          seoKeywords: data.contact.seoKeywords ?? "",
          canonicalUrl: data.contact.canonicalUrl ?? "",
          ogImageUrl: data.contact.ogImageUrl ?? "",
          twitterImageUrl: data.contact.twitterImageUrl ?? "",
        });
      } catch {
        toast.error("Failed to load the contact section");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      toast.success("Contact section updated");
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
        title="Contact"
        description="Manage the homepage quote-request section and its heading."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Contact section</CardTitle>
            <CardDescription>
              The phone, email and address shown beside the form come from Top Bar, and each
              one stays hidden while its field is empty.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !form ? (
              <div className="h-40 animate-pulse rounded-xl bg-muted" />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="cards">Contact cards</TabsTrigger>
                    <TabsTrigger value="form">Form</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                      <Switch
                        checked={form.isVisible}
                        onCheckedChange={(isVisible) => setForm({ ...form, isVisible })}
                      />
                      <Label>Section visible</Label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Section badge</Label>
                        <Input
                          maxLength={60}
                          value={form.tagline}
                          onChange={(event) => setForm({ ...form, tagline: event.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Badge background</Label>
                        <Input
                          value={form.taglineBg}
                          onChange={(event) =>
                            setForm({ ...form, taglineBg: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title line 1</Label>
                        <Input
                          maxLength={120}
                          value={form.titleLine1}
                          onChange={(event) =>
                            setForm({ ...form, titleLine1: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title line 2</Label>
                        <Input
                          maxLength={120}
                          value={form.titleLine2}
                          onChange={(event) =>
                            setForm({ ...form, titleLine2: event.target.value })
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cards" className="mt-4 space-y-6">
                    <p className="text-xs text-muted-foreground">
                      Leave a value empty to inherit it from Top Bar. A card stays hidden while
                      both are empty.
                    </p>

                    <div className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={form.showPhone}
                          onCheckedChange={(showPhone) => setForm({ ...form, showPhone })}
                        />
                        <Label>Show the phone card</Label>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Heading</Label>
                          <Input
                            maxLength={60}
                            value={form.phoneTitle}
                            onChange={(event) =>
                              setForm({ ...form, phoneTitle: event.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone number</Label>
                          <Input
                            maxLength={60}
                            value={form.phoneText}
                            onChange={(event) =>
                              setForm({ ...form, phoneText: event.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone link</Label>
                          <Input
                            placeholder="tel:+919999999999"
                            value={form.phoneHref}
                            onChange={(event) =>
                              setForm({ ...form, phoneHref: event.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={form.showEmail}
                          onCheckedChange={(showEmail) => setForm({ ...form, showEmail })}
                        />
                        <Label>Show the email card</Label>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Heading</Label>
                          <Input
                            maxLength={60}
                            value={form.emailTitle}
                            onChange={(event) =>
                              setForm({ ...form, emailTitle: event.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email address</Label>
                          <Input
                            maxLength={160}
                            value={form.emailText}
                            onChange={(event) =>
                              setForm({ ...form, emailText: event.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={form.showLocation}
                          onCheckedChange={(showLocation) => setForm({ ...form, showLocation })}
                        />
                        <Label>Show the address card</Label>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Heading</Label>
                          <Input
                            maxLength={60}
                            value={form.locationTitle}
                            onChange={(event) =>
                              setForm({ ...form, locationTitle: event.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Address</Label>
                          <Input
                            maxLength={200}
                            value={form.locationText}
                            onChange={(event) =>
                              setForm({ ...form, locationText: event.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Map URL</Label>
                          <Input
                            value={form.locationUrl}
                            onChange={(event) =>
                              setForm({ ...form, locationUrl: event.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="form" className="mt-4 space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Field placeholders. Name, mail, mobile and location are always required;
                      company name is optional.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name field</Label>
                        <Input
                          maxLength={60}
                          value={form.nameLabel}
                          onChange={(event) =>
                            setForm({ ...form, nameLabel: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company field</Label>
                        <Input
                          maxLength={60}
                          value={form.companyLabel}
                          onChange={(event) =>
                            setForm({ ...form, companyLabel: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mail field</Label>
                        <Input
                          maxLength={60}
                          value={form.emailLabel}
                          onChange={(event) =>
                            setForm({ ...form, emailLabel: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mobile field</Label>
                        <Input
                          maxLength={60}
                          value={form.mobileLabel}
                          onChange={(event) =>
                            setForm({ ...form, mobileLabel: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location field</Label>
                        <Input
                          maxLength={60}
                          value={form.locationLabel}
                          onChange={(event) =>
                            setForm({ ...form, locationLabel: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Submit button label</Label>
                        <Input
                          maxLength={40}
                          value={form.submitLabel}
                          onChange={(event) =>
                            setForm({ ...form, submitLabel: event.target.value })
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                      <Switch
                        checked={form.showSideImage}
                        onCheckedChange={(showSideImage) => setForm({ ...form, showSideImage })}
                      />
                      <div>
                        <Label>Show the cut-out image</Label>
                        <p className="text-xs text-muted-foreground">
                          Sits at the bottom-right of the section on screens wider than 1400px.
                          A transparent PNG works best.
                        </p>
                      </div>
                    </div>
                    <ImageField
                      label="Cut-out image"
                      value={form.sideImageUrl}
                      onChange={(sideImageUrl) => setForm({ ...form, sideImageUrl })}
                    />
                    <div className="space-y-2">
                      <Label>Cut-out alt text</Label>
                      <Input
                        maxLength={160}
                        value={form.sideImageAlt}
                        onChange={(event) =>
                          setForm({ ...form, sideImageAlt: event.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                      <Switch
                        checked={form.showShape}
                        onCheckedChange={(showShape) => setForm({ ...form, showShape })}
                      />
                      <Label>Show the decorative arc shape</Label>
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>SEO title</Label>
                        <Input
                          value={form.seoTitle}
                          onChange={(event) =>
                            setForm({ ...form, seoTitle: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SEO keywords</Label>
                        <Input
                          value={form.seoKeywords}
                          onChange={(event) =>
                            setForm({ ...form, seoKeywords: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Canonical URL</Label>
                        <Input
                          value={form.canonicalUrl}
                          onChange={(event) =>
                            setForm({ ...form, canonicalUrl: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>OG image URL</Label>
                        <Input
                          value={form.ogImageUrl}
                          onChange={(event) =>
                            setForm({ ...form, ogImageUrl: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Twitter image URL</Label>
                        <Input
                          value={form.twitterImageUrl}
                          onChange={(event) =>
                            setForm({ ...form, twitterImageUrl: event.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>SEO description</Label>
                      <Textarea
                        rows={3}
                        value={form.seoDescription}
                        onChange={(event) =>
                          setForm({ ...form, seoDescription: event.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={form.noIndex}
                        onCheckedChange={(noIndex) => setForm({ ...form, noIndex })}
                      />
                      <Label>NoIndex</Label>
                    </div>
                  </TabsContent>
                </Tabs>

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
