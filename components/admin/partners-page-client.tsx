"use client";

import { useEffect, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PARTNER_VARIANTS, type PartnerMarqueeItem, type PartnerVariant } from "@/lib/cms/types";

type PartnersPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

const variantLabels: Record<PartnerVariant, string> = {
  default: "Default",
  stacked: "Stacked",
  script: "Script",
  dual: "Dual line",
  brand: "Brand",
};

export function PartnersPageClient({ user }: PartnersPageProps) {
  const [label, setLabel] = useState("Trusted by Businesses Across India");
  const [partners, setPartners] = useState<PartnerMarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/partners");
      const data = await response.json();
      setLabel(data.label ?? "Trusted by Businesses Across India");
      setPartners(
        Array.isArray(data.partners)
          ? data.partners.map((partner: PartnerMarqueeItem, index: number) => ({
              ...partner,
              tagline: partner.tagline ?? "",
              logoUrl: partner.logoUrl ?? "",
              variant: partner.variant ?? "default",
              sortOrder: partner.sortOrder ?? index,
              visible: partner.visible ?? true,
            }))
          : [],
      );
      setLoading(false);
    }
    void load();
  }, []);

  function updatePartner(index: number, patch: Partial<PartnerMarqueeItem>) {
    setPartners((current) =>
      current.map((partner, partnerIndex) =>
        partnerIndex === index ? { ...partner, ...patch } : partner,
      ),
    );
  }

  function addPartner() {
    setPartners((current) => [
      ...current,
      {
        name: "New Partner",
        tagline: "",
        logoUrl: "",
        variant: "default",
        sortOrder: current.length,
        visible: true,
      },
    ]);
  }

  function removePartner(index: number) {
    setPartners((current) =>
      current
        .filter((_, partnerIndex) => partnerIndex !== index)
        .map((partner, partnerIndex) => ({ ...partner, sortOrder: partnerIndex })),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        label,
        partners: partners.map((partner, index) => ({
          name: partner.name,
          tagline: partner.tagline || null,
          logoUrl: partner.logoUrl || null,
          variant: partner.variant,
          sortOrder: index,
          visible: partner.visible,
        })),
      };
      const response = await fetch("/api/admin/partners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setLabel(data.label);
      setPartners(
        data.partners.map((partner: PartnerMarqueeItem, index: number) => ({
          ...partner,
          tagline: partner.tagline ?? "",
          logoUrl: partner.logoUrl ?? "",
          sortOrder: partner.sortOrder ?? index,
        })),
      );
      toast.success("Partner marquee updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const visibleCount = partners.filter((partner) => partner.visible).length;

  return (
    <>
      <AdminHeader
        user={user}
        title="Partner Marquee"
        description="Manage the trusted-by logo strip under the homepage hero."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>Marquee settings</CardTitle>
                <CardDescription>
                  Section label shown beside the scrolling partner logos.
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {visibleCount} visible / {partners.length} total
              </Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-10 animate-pulse rounded-md bg-muted" />
              ) : (
                <div className="space-y-2 max-w-xl">
                  <Label htmlFor="marquee-label">Label</Label>
                  <Input
                    id="marquee-label"
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Partners</CardTitle>
                <CardDescription>
                  Add logos or styled text marks. Hidden partners stay in CMS but leave the
                  public marquee.
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addPartner} disabled={loading}>
                <Plus className="size-4" />
                Add partner
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {partners.map((partner, index) => (
                    <div
                      key={`${partner.id ?? "new"}-${index}`}
                      className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center text-muted-foreground">
                          <GripVertical className="size-4" />
                          <span className="ml-1 text-xs font-medium">#{index + 1}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={partner.visible}
                              onCheckedChange={(visible) => updatePartner(index, { visible })}
                            />
                            <Label>Visible</Label>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removePartner(index)}
                            aria-label="Remove partner"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={partner.name}
                            onChange={(event) =>
                              updatePartner(index, { name: event.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tagline</Label>
                          <Input
                            value={partner.tagline ?? ""}
                            onChange={(event) =>
                              updatePartner(index, { tagline: event.target.value })
                            }
                            placeholder="Optional"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Text variant</Label>
                          <Select
                            value={partner.variant}
                            onValueChange={(variant) => {
                              if (variant) {
                                updatePartner(index, {
                                  variant: variant as PartnerVariant,
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PARTNER_VARIANTS.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {variantLabels[option]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2 xl:col-span-1">
                          <Label>Preview</Label>
                          <div className="flex h-9 items-center rounded-xl border border-dashed border-border/80 bg-background px-3 text-sm">
                            {partner.logoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={partner.logoUrl}
                                alt={partner.name}
                                className="max-h-6 max-w-full object-contain"
                              />
                            ) : (
                              <span className="truncate text-muted-foreground">
                                {partner.name}
                                {partner.tagline ? ` · ${partner.tagline}` : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <ImageField
                        label="Logo image (optional)"
                        value={partner.logoUrl ?? ""}
                        onChange={(logoUrl) => updatePartner(index, { logoUrl })}
                      />
                    </div>
                  ))}

                  {!partners.length ? (
                    <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                      No partners yet. Add your first logo to populate the marquee.
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <SaveButton loading={saving} />
          </div>
        </form>
      </main>
    </>
  );
}
