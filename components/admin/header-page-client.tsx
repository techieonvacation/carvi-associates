"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { SaveButton } from "@/components/admin/save-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type HeaderForm = {
  contactCtaText: string;
  contactCtaHref: string;
};

type HeaderPageProps = {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER";
  };
};

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
      toast.success("Header CTA updated");
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
        title="Header CTA"
        description="Configure the contact button shown in the main site header."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Header button</CardTitle>
            <CardDescription>Update the primary call-to-action in the navigation bar.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !form ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-10 animate-pulse rounded-md bg-muted" />
                <div className="h-10 animate-pulse rounded-md bg-muted" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactCtaText">Button text</Label>
                    <Input
                      id="contactCtaText"
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
