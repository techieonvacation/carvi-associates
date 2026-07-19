"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SocialItem = {
  label: string;
  href: string;
  icon: string;
  sortOrder: number;
  visible: boolean;
};

const iconOptions = [
  { value: "fa-facebook-f", label: "Facebook" },
  { value: "fa-twitter", label: "X" },
  { value: "fa-linkedin-in", label: "LinkedIn" },
  { value: "fa-instagram", label: "Instagram" },
];

type SocialsPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

export function SocialsPageClient({ user }: SocialsPageProps) {
  const [items, setItems] = useState<SocialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/socials");
      const data = await response.json();
      setItems(data.items);
      setLoading(false);
    }
    void load();
  }, []);

  function updateItem(index: number, patch: Partial<SocialItem>) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        items: items.map((item, index) => ({
          ...item,
          sortOrder: index,
        })),
      };
      const response = await fetch("/api/admin/socials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setItems(data.items);
      toast.success("Social links updated");
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
        title="Social Links"
        description="Manage social profiles shown in the top bar and mobile menu."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Social profiles</CardTitle>
              <CardDescription>Links appear in the top bar and mobile navigation drawer.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setItems((current) => [
                  ...current,
                  {
                    label: "New Social",
                    href: "https://",
                    icon: "fa-facebook-f",
                    sortOrder: current.length,
                    visible: true,
                  },
                ])
              }
            >
              <Plus className="size-4" />
              Add social
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="grid gap-4 rounded-xl border border-border/70 bg-muted/20 p-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_180px_auto_auto]"
                  >
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={item.label}
                        onChange={(event) => updateItem(index, { label: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input
                        value={item.href}
                        onChange={(event) => updateItem(index, { href: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Select
                        value={item.icon}
                        onValueChange={(icon) => {
                          if (icon) updateItem(index, { icon });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-2 pb-1">
                      <Switch
                        checked={item.visible}
                        onCheckedChange={(visible) => updateItem(index, { visible })}
                      />
                      <Label>Visible</Label>
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setItems((current) =>
                            current.filter((_, itemIndex) => itemIndex !== index),
                          )
                        }
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
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
