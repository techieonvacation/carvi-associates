"use client";

import { useEffect, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type NavItem = {
  id?: string;
  label: string;
  href: string;
  sortOrder: number;
  visible: boolean;
};

type NavigationPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

export function NavigationPageClient({ user }: NavigationPageProps) {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/navigation");
      const data = await response.json();
      setItems(data.items);
      setLoading(false);
    }
    void load();
  }, []);

  function updateItem(index: number, patch: Partial<NavItem>) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        label: "New Link",
        href: "#",
        sortOrder: current.length,
        visible: true,
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((current) =>
      current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({ ...item, sortOrder: itemIndex })),
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
      const response = await fetch("/api/admin/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setItems(data.items);
      toast.success("Navigation updated");
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
        title="Navigation"
        description="Configure the primary navbar links for desktop and mobile menus."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Menu items</CardTitle>
              <CardDescription>Drag order by using the sort index and toggle visibility per link.</CardDescription>
            </div>
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="size-4" />
              Add link
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="grid gap-4 rounded-xl border border-border/70 bg-muted/20 p-4 md:grid-cols-[auto_1fr_1fr_auto_auto]"
                  >
                    <div className="flex items-center text-muted-foreground">
                      <GripVertical className="size-4" />
                      <span className="ml-1 text-xs font-medium">{index + 1}</span>
                    </div>
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
                        onClick={() => removeItem(index)}
                        aria-label="Remove link"
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
