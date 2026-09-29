"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Copy, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSeoCollection } from "@/hooks/use-seo-collection";
import {
  SCHEMA_TYPE_OPTIONS,
  SEO_SCOPE_KINDS,
  type SeoFaqItem,
  type SeoSchemaItem,
} from "@/lib/seo/types";

type AdminUser = { name: string; email: string; role: "ADMIN" | "MANAGER" };

type FaqForm = {
  question: string;
  answer: string;
  scope: string;
  pagePath: string;
  category: string;
  keywords: string;
  isSpeakable: boolean;
  showOnPage: boolean;
  isActive: boolean;
  isVisible: boolean;
};

type SchemaForm = {
  name: string;
  schemaType: string;
  jsonLd: string;
  scope: string;
  pagePath: string;
  notes: string;
  isActive: boolean;
};

const emptyFaq: FaqForm = {
  question: "",
  answer: "",
  scope: "GLOBAL",
  pagePath: "",
  category: "",
  keywords: "",
  isSpeakable: true,
  showOnPage: true,
  isActive: true,
  isVisible: true,
};

const emptySchema: SchemaForm = {
  name: "",
  schemaType: "Service",
  jsonLd: '{\n  "@type": "Service",\n  "name": "GST Advisory"\n}',
  scope: "GLOBAL",
  pagePath: "",
  notes: "",
  isActive: true,
};

export function SeoStructuredDataPageClient({ user }: { user: AdminUser }) {
  const faqs = useSeoCollection<SeoFaqItem, Record<string, unknown>>({
    resource: "faqs",
    collectionKey: "faqs",
    itemKey: "faq",
    label: "FAQ",
  });
  const schemas = useSeoCollection<SeoSchemaItem, Record<string, unknown>>({
    resource: "schemas",
    collectionKey: "schemas",
    itemKey: "schema",
    label: "Schema block",
  });

  const [faqId, setFaqId] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState<FaqForm | null>(null);
  const [schemaId, setSchemaId] = useState<string | null>(null);
  const [schemaForm, setSchemaForm] = useState<SchemaForm | null>(null);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  function startFaq(item?: SeoFaqItem) {
    if (item) {
      setFaqId(item.id);
      setFaqForm({
        question: item.question,
        answer: item.answer,
        scope: item.scope,
        pagePath: item.pagePath,
        category: item.category,
        keywords: item.keywords,
        isSpeakable: item.isSpeakable,
        showOnPage: item.showOnPage,
        isActive: item.isActive,
        isVisible: item.isVisible,
      });
    } else {
      setFaqId("new");
      setFaqForm({ ...emptyFaq });
    }
  }

  function startSchema(item?: SeoSchemaItem) {
    if (item) {
      setSchemaId(item.id);
      setSchemaForm({
        name: item.name,
        schemaType: item.schemaType,
        jsonLd: JSON.stringify(item.jsonLd, null, 2),
        scope: item.scope,
        pagePath: item.pagePath,
        notes: item.notes,
        isActive: item.isActive,
      });
    } else {
      setSchemaId("new");
      setSchemaForm({ ...emptySchema });
    }
    setSchemaError(null);
  }

  async function submitFaq(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!faqForm) return;
    const ok =
      faqId === "new" ? await faqs.create(faqForm) : await faqs.update(faqId as string, faqForm);
    if (ok) {
      setFaqId(null);
      setFaqForm(null);
    }
  }

  async function submitSchema(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!schemaForm) return;

    let jsonLd: unknown;
    try {
      jsonLd = JSON.parse(schemaForm.jsonLd);
      setSchemaError(null);
    } catch {
      setSchemaError("JSON-LD is not valid JSON");
      return;
    }

    const payload = { ...schemaForm, jsonLd };
    const ok =
      schemaId === "new"
        ? await schemas.create(payload)
        : await schemas.update(schemaId as string, payload);

    if (ok) {
      setSchemaId(null);
      setSchemaForm(null);
    }
  }

  async function moveFaq(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= faqs.items.length) return;
    const ordered = [...faqs.items];
    const [item] = ordered.splice(index, 1);
    ordered.splice(target, 0, item);
    await faqs.reorder(ordered.map((entry) => entry.id));
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Structured data & answers"
        description="FAQ answers for AI engines and custom JSON-LD blocks for rich results."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Tabs defaultValue="faqs">
          <TabsList>
            <TabsTrigger value="faqs">Answers &amp; FAQs</TabsTrigger>
            <TabsTrigger value="schemas">JSON-LD blocks</TabsTrigger>
          </TabsList>

          <TabsContent value="faqs" className="mt-4 space-y-6">
            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Answer library</CardTitle>
                  <CardDescription>
                    Published as FAQPage structured data and rendered on the page so the markup
                    matches visible content.
                  </CardDescription>
                </div>
                <Button type="button" onClick={() => startFaq()}>
                  <Plus className="size-4" />
                  Add answer
                </Button>
              </CardHeader>
              <CardContent>
                {faqs.loading ? (
                  <div className="h-48 animate-pulse rounded-xl bg-muted" />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border/70">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">Order</TableHead>
                          <TableHead>Question</TableHead>
                          <TableHead className="w-40">Scope</TableHead>
                          <TableHead className="w-28">On page</TableHead>
                          <TableHead className="w-28">Status</TableHead>
                          <TableHead className="w-20" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {faqs.items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                              No answers yet. Add the questions prospects actually ask.
                            </TableCell>
                          </TableRow>
                        ) : (
                          faqs.items.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() => void moveFaq(index, -1)}
                                  >
                                    <ArrowUp className="size-3.5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() => void moveFaq(index, 1)}
                                  >
                                    <ArrowDown className="size-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="max-w-[420px]">
                                <button
                                  type="button"
                                  className="text-left font-medium hover:text-accent dark:hover:text-primary"
                                  onClick={() => startFaq(item)}
                                >
                                  {item.question}
                                </button>
                                <p className="truncate text-xs text-muted-foreground">{item.answer}</p>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {item.scope === "GLOBAL" ? "Site-wide" : item.pagePath || "Page"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={item.showOnPage ? "secondary" : "outline"}>
                                  {item.showOnPage ? "Visible" : "Schema only"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={item.isActive && item.isVisible ? "secondary" : "outline"}>
                                  {item.isActive && item.isVisible ? "Live" : "Hidden"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => void faqs.bulk([item.id], "duplicate")}
                                  >
                                    <Copy className="size-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => void faqs.remove(item.id)}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {faqs.trashed.length ? (
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Trash</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {faqs.trashed.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3"
                    >
                      <p className="truncate font-medium">{item.question}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => void faqs.bulk([item.id], "restore")}
                        >
                          <RotateCcw className="size-4" />
                          Restore
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => void faqs.remove(item.id, true)}
                        >
                          <Trash2 className="size-4" />
                          Delete forever
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {faqForm && faqId ? (
              <Card className="border-primary/40">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <CardTitle>{faqId === "new" ? "New answer" : "Edit answer"}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setFaqId(null);
                      setFaqForm(null);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitFaq} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Input
                        value={faqForm.question}
                        placeholder="How much does a statutory audit cost?"
                        onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Answer</Label>
                      <Textarea
                        rows={5}
                        value={faqForm.answer}
                        placeholder="Answer the question completely in the first two sentences."
                        onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        {faqForm.answer.trim().length} characters — assistants quote the opening
                        sentences, so lead with the answer.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Scope</Label>
                        <Select
                          value={faqForm.scope}
                          onValueChange={(value) => value && setFaqForm({ ...faqForm, scope: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEO_SCOPE_KINDS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option === "GLOBAL" ? "Site-wide" : "Single route"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {faqForm.scope === "PAGE" ? (
                        <div className="space-y-2">
                          <Label>Route path</Label>
                          <Input
                            value={faqForm.pagePath}
                            placeholder="/insight"
                            onChange={(e) => setFaqForm({ ...faqForm, pagePath: e.target.value })}
                          />
                        </div>
                      ) : null}
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input
                          value={faqForm.category}
                          placeholder="Pricing"
                          onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Keywords</Label>
                        <Input
                          value={faqForm.keywords}
                          onChange={(e) => setFaqForm({ ...faqForm, keywords: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={faqForm.showOnPage}
                          onCheckedChange={(value) => setFaqForm({ ...faqForm, showOnPage: value })}
                        />
                        <Label>Render on the page</Label>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={faqForm.isSpeakable}
                          onCheckedChange={(value) => setFaqForm({ ...faqForm, isSpeakable: value })}
                        />
                        <Label>Voice assistants may read it</Label>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={faqForm.isActive}
                          onCheckedChange={(value) => setFaqForm({ ...faqForm, isActive: value })}
                        />
                        <Label>Active</Label>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={faqForm.isVisible}
                          onCheckedChange={(value) => setFaqForm({ ...faqForm, isVisible: value })}
                        />
                        <Label>Visible</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFaqId(null);
                          setFaqForm(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <SaveButton loading={faqs.saving} label="Save answer" />
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="schemas" className="mt-4 space-y-6">
            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Custom JSON-LD</CardTitle>
                  <CardDescription>
                    Merged into the page graph alongside the generated Organization, WebSite and
                    WebPage nodes.
                  </CardDescription>
                </div>
                <Button type="button" onClick={() => startSchema()}>
                  <Plus className="size-4" />
                  Add block
                </Button>
              </CardHeader>
              <CardContent>
                {schemas.loading ? (
                  <div className="h-48 animate-pulse rounded-xl bg-muted" />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border/70">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-40">Type</TableHead>
                          <TableHead className="w-40">Scope</TableHead>
                          <TableHead className="w-28">Status</TableHead>
                          <TableHead className="w-20" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schemas.items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                              No custom blocks yet.
                            </TableCell>
                          </TableRow>
                        ) : (
                          schemas.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <button
                                  type="button"
                                  className="text-left font-medium hover:text-accent dark:hover:text-primary"
                                  onClick={() => startSchema(item)}
                                >
                                  {item.name}
                                </button>
                                {item.notes ? (
                                  <p className="truncate text-xs text-muted-foreground">{item.notes}</p>
                                ) : null}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.schemaType}</Badge>
                              </TableCell>
                              <TableCell>
                                {item.scope === "GLOBAL" ? "Site-wide" : item.pagePath || "Page"}
                              </TableCell>
                              <TableCell>
                                <Badge variant={item.isActive ? "secondary" : "outline"}>
                                  {item.isActive ? "Live" : "Paused"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => void schemas.bulk([item.id], "duplicate")}
                                  >
                                    <Copy className="size-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => void schemas.remove(item.id)}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {schemas.trashed.length ? (
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Trash</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {schemas.trashed.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3"
                    >
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => void schemas.bulk([item.id], "restore")}
                        >
                          <RotateCcw className="size-4" />
                          Restore
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => void schemas.remove(item.id, true)}
                        >
                          <Trash2 className="size-4" />
                          Delete forever
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {schemaForm && schemaId ? (
              <Card className="border-primary/40">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <CardTitle>{schemaId === "new" ? "New JSON-LD block" : "Edit JSON-LD block"}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSchemaId(null);
                      setSchemaForm(null);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitSchema} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Block name</Label>
                        <Input
                          value={schemaForm.name}
                          onChange={(e) => setSchemaForm({ ...schemaForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Schema type</Label>
                        <Select
                          value={schemaForm.schemaType}
                          onValueChange={(value) =>
                            value && setSchemaForm({ ...schemaForm, schemaType: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SCHEMA_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Scope</Label>
                        <Select
                          value={schemaForm.scope}
                          onValueChange={(value) =>
                            value && setSchemaForm({ ...schemaForm, scope: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEO_SCOPE_KINDS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option === "GLOBAL" ? "Site-wide" : "Single route"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {schemaForm.scope === "PAGE" ? (
                        <div className="space-y-2">
                          <Label>Route path</Label>
                          <Input
                            value={schemaForm.pagePath}
                            placeholder="/"
                            onChange={(e) =>
                              setSchemaForm({ ...schemaForm, pagePath: e.target.value })
                            }
                          />
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label>JSON-LD</Label>
                      <Textarea
                        rows={14}
                        className="font-mono text-xs"
                        value={schemaForm.jsonLd}
                        onChange={(e) => setSchemaForm({ ...schemaForm, jsonLd: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Omit @context — the graph wrapper supplies it. Use @id to reference the
                        organization node at {"{origin}/#organization"}.
                      </p>
                      {schemaError ? <p className="text-sm text-destructive">{schemaError}</p> : null}
                    </div>

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        rows={2}
                        value={schemaForm.notes}
                        onChange={(e) => setSchemaForm({ ...schemaForm, notes: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={schemaForm.isActive}
                        onCheckedChange={(value) => setSchemaForm({ ...schemaForm, isActive: value })}
                      />
                      <Label>Publish this block</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSchemaId(null);
                          setSchemaForm(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <SaveButton loading={schemas.saving} label="Save block" />
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
