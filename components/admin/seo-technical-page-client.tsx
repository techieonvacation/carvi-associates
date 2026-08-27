"use client";

import { useState } from "react";
import { Plus, RefreshCw, RotateCcw, Send, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { SaveButton } from "@/components/admin/save-button";
import { StringListField } from "@/components/admin/seo/string-list-field";
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
  SEO_CHANGE_FREQUENCIES,
  SEO_REDIRECT_MATCHES,
  SEO_REDIRECT_STATUS_CODES,
  type SeoRedirectItem,
  type SeoRobotsRuleItem,
  type SeoSitemapEntryItem,
} from "@/lib/seo/types";

type AdminUser = { name: string; email: string; role: "ADMIN" | "MANAGER" };

type RedirectForm = {
  source: string;
  destination: string;
  statusCode: number;
  matchType: string;
  preserveQuery: boolean;
  notes: string;
  isActive: boolean;
};

type RuleForm = {
  userAgent: string;
  allowPaths: string[];
  disallowPaths: string[];
  crawlDelay: string;
  notes: string;
  isActive: boolean;
};

type EntryForm = {
  url: string;
  changeFrequency: string;
  priority: number;
  lastModified: string;
  imageUrls: string[];
  notes: string;
  isActive: boolean;
};

const emptyRedirect: RedirectForm = {
  source: "",
  destination: "",
  statusCode: 308,
  matchType: "EXACT",
  preserveQuery: true,
  notes: "",
  isActive: true,
};

const emptyRule: RuleForm = {
  userAgent: "*",
  allowPaths: ["/"],
  disallowPaths: [],
  crawlDelay: "",
  notes: "",
  isActive: true,
};

const emptyEntry: EntryForm = {
  url: "",
  changeFrequency: "MONTHLY",
  priority: 0.5,
  lastModified: "",
  imageUrls: [],
  notes: "",
  isActive: true,
};

const STATUS_LABELS: Record<number, string> = {
  301: "301 — moved permanently",
  302: "302 — found (temporary)",
  307: "307 — temporary, method preserved",
  308: "308 — permanent, method preserved",
};

export function SeoTechnicalPageClient({ user }: { user: AdminUser }) {
  const redirects = useSeoCollection<SeoRedirectItem, Record<string, unknown>>({
    resource: "redirects",
    collectionKey: "redirects",
    itemKey: "redirect",
    label: "Redirect",
  });
  const rules = useSeoCollection<SeoRobotsRuleItem, Record<string, unknown>>({
    resource: "robots-rules",
    collectionKey: "rules",
    itemKey: "rule",
    label: "Robots rule",
  });
  const entries = useSeoCollection<SeoSitemapEntryItem, Record<string, unknown>>({
    resource: "sitemap-entries",
    collectionKey: "entries",
    itemKey: "entry",
    label: "Sitemap entry",
  });

  const [redirectId, setRedirectId] = useState<string | null>(null);
  const [redirectForm, setRedirectForm] = useState<RedirectForm | null>(null);
  const [ruleId, setRuleId] = useState<string | null>(null);
  const [ruleForm, setRuleForm] = useState<RuleForm | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [entryForm, setEntryForm] = useState<EntryForm | null>(null);

  const [preview, setPreview] = useState<{ kind: string; content: string } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [indexNowUrls, setIndexNowUrls] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadPreview(kind: "robots" | "llms") {
    setPreviewLoading(true);
    try {
      const response = await fetch(`/api/admin/seo/preview?kind=${kind}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Preview failed");
      setPreview({ kind, content: data.content });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Preview failed");
    } finally {
      setPreviewLoading(false);
    }
  }

  async function submitIndexNow() {
    const urls = indexNowUrls
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!urls.length) {
      toast.error("Add at least one URL");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/seo/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Submission failed");
      toast.success(`${data.submitted} URLs submitted (status ${data.status})`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitRedirect(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!redirectForm) return;
    const ok =
      redirectId === "new"
        ? await redirects.create(redirectForm)
        : await redirects.update(redirectId as string, redirectForm);
    if (ok) {
      setRedirectId(null);
      setRedirectForm(null);
    }
  }

  async function submitRule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ruleForm) return;
    const payload = {
      ...ruleForm,
      allowPaths: ruleForm.allowPaths.filter(Boolean),
      disallowPaths: ruleForm.disallowPaths.filter(Boolean),
      crawlDelay: ruleForm.crawlDelay === "" ? null : Number(ruleForm.crawlDelay),
    };
    const ok =
      ruleId === "new" ? await rules.create(payload) : await rules.update(ruleId as string, payload);
    if (ok) {
      setRuleId(null);
      setRuleForm(null);
    }
  }

  async function submitEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!entryForm) return;
    const payload = {
      ...entryForm,
      imageUrls: entryForm.imageUrls.filter(Boolean),
      lastModified: entryForm.lastModified ? new Date(entryForm.lastModified).toISOString() : null,
    };
    const ok =
      entryId === "new"
        ? await entries.create(payload)
        : await entries.update(entryId as string, payload);
    if (ok) {
      setEntryId(null);
      setEntryForm(null);
    }
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Technical SEO"
        description="Redirects, crawler rules, extra sitemap URLs, file previews and IndexNow."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Tabs defaultValue="redirects">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="redirects">Redirects</TabsTrigger>
            <TabsTrigger value="robots">Crawler rules</TabsTrigger>
            <TabsTrigger value="sitemap">Extra sitemap URLs</TabsTrigger>
            <TabsTrigger value="files">Generated files</TabsTrigger>
          </TabsList>

          <TabsContent value="redirects" className="mt-4 space-y-6">
            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Redirects</CardTitle>
                  <CardDescription>
                    Applied before rendering so link equity from retired URLs is preserved.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setRedirectId("new");
                    setRedirectForm({ ...emptyRedirect });
                  }}
                >
                  <Plus className="size-4" />
                  Add redirect
                </Button>
              </CardHeader>
              <CardContent>
                {redirects.loading ? (
                  <div className="h-48 animate-pulse rounded-xl bg-muted" />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border/70">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source</TableHead>
                          <TableHead>Destination</TableHead>
                          <TableHead className="w-28">Status</TableHead>
                          <TableHead className="w-28">Match</TableHead>
                          <TableHead className="w-24">Hits</TableHead>
                          <TableHead className="w-20" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {redirects.items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                              No redirects configured.
                            </TableCell>
                          </TableRow>
                        ) : (
                          redirects.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <button
                                  type="button"
                                  className="text-left font-mono text-xs hover:text-primary"
                                  onClick={() => {
                                    setRedirectId(item.id);
                                    setRedirectForm({
                                      source: item.source,
                                      destination: item.destination,
                                      statusCode: item.statusCode,
                                      matchType: item.matchType,
                                      preserveQuery: item.preserveQuery,
                                      notes: item.notes,
                                      isActive: item.isActive,
                                    });
                                  }}
                                >
                                  {item.source}
                                </button>
                              </TableCell>
                              <TableCell className="font-mono text-xs">{item.destination}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.statusCode}</Badge>
                              </TableCell>
                              <TableCell className="text-xs">{item.matchType.toLowerCase()}</TableCell>
                              <TableCell className="text-xs">{item.hitCount}</TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => void redirects.remove(item.id)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
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

            {redirects.trashed.length ? (
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Trash</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {redirects.trashed.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3"
                    >
                      <p className="font-mono text-xs">{item.source}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => void redirects.bulk([item.id], "restore")}
                        >
                          <RotateCcw className="size-4" />
                          Restore
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => void redirects.remove(item.id, true)}
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

            {redirectForm && redirectId ? (
              <Card className="border-primary/40">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <CardTitle>{redirectId === "new" ? "New redirect" : "Edit redirect"}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setRedirectId(null);
                      setRedirectForm(null);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitRedirect} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Source path</Label>
                        <Input
                          value={redirectForm.source}
                          placeholder="/old-services"
                          onChange={(e) =>
                            setRedirectForm({ ...redirectForm, source: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Destination</Label>
                        <Input
                          value={redirectForm.destination}
                          placeholder="/#services"
                          onChange={(e) =>
                            setRedirectForm({ ...redirectForm, destination: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status code</Label>
                        <Select
                          value={String(redirectForm.statusCode)}
                          onValueChange={(value) =>
                            value &&
                            setRedirectForm({ ...redirectForm, statusCode: Number(value) })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEO_REDIRECT_STATUS_CODES.map((code) => (
                              <SelectItem key={code} value={String(code)}>
                                {STATUS_LABELS[code]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Match type</Label>
                        <Select
                          value={redirectForm.matchType}
                          onValueChange={(value) =>
                            value && setRedirectForm({ ...redirectForm, matchType: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEO_REDIRECT_MATCHES.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option === "EXACT"
                                  ? "Exact path"
                                  : option === "PREFIX"
                                    ? "Path prefix"
                                    : "Regular expression"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {redirectForm.matchType === "PREFIX"
                            ? "Everything after the prefix is carried over, so /legacy/report becomes /blog/report."
                            : redirectForm.matchType === "REGEX"
                              ? "Capture groups are available in the destination as $1, $2 and so on."
                              : "Only this exact path is redirected."}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={redirectForm.preserveQuery}
                          onCheckedChange={(value) =>
                            setRedirectForm({ ...redirectForm, preserveQuery: value })
                          }
                        />
                        <Label>Carry the query string across</Label>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={redirectForm.isActive}
                          onCheckedChange={(value) =>
                            setRedirectForm({ ...redirectForm, isActive: value })
                          }
                        />
                        <Label>Redirect is active</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        rows={2}
                        value={redirectForm.notes}
                        onChange={(e) => setRedirectForm({ ...redirectForm, notes: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setRedirectId(null);
                          setRedirectForm(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <SaveButton loading={redirects.saving} label="Save redirect" />
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="robots" className="mt-4 space-y-6">
            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Crawler rules</CardTitle>
                  <CardDescription>
                    One block per user agent, rendered into robots.txt in this order.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setRuleId("new");
                    setRuleForm({ ...emptyRule });
                  }}
                >
                  <Plus className="size-4" />
                  Add rule
                </Button>
              </CardHeader>
              <CardContent>
                {rules.loading ? (
                  <div className="h-48 animate-pulse rounded-xl bg-muted" />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border/70">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User agent</TableHead>
                          <TableHead>Allow</TableHead>
                          <TableHead>Disallow</TableHead>
                          <TableHead className="w-28">Status</TableHead>
                          <TableHead className="w-20" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rules.items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                              No rules yet — a safe default block is served until you add one.
                            </TableCell>
                          </TableRow>
                        ) : (
                          rules.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <button
                                  type="button"
                                  className="text-left font-mono text-xs hover:text-primary"
                                  onClick={() => {
                                    setRuleId(item.id);
                                    setRuleForm({
                                      userAgent: item.userAgent,
                                      allowPaths: item.allowPaths,
                                      disallowPaths: item.disallowPaths,
                                      crawlDelay:
                                        item.crawlDelay === null ? "" : String(item.crawlDelay),
                                      notes: item.notes,
                                      isActive: item.isActive,
                                    });
                                  }}
                                >
                                  {item.userAgent}
                                </button>
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {item.allowPaths.join(", ") || "—"}
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {item.disallowPaths.join(", ") || "—"}
                              </TableCell>
                              <TableCell>
                                <Badge variant={item.isActive ? "secondary" : "outline"}>
                                  {item.isActive ? "Live" : "Paused"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => void rules.remove(item.id)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
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

            {ruleForm && ruleId ? (
              <Card className="border-primary/40">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <CardTitle>{ruleId === "new" ? "New crawler rule" : "Edit crawler rule"}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setRuleId(null);
                      setRuleForm(null);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitRule} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>User agent</Label>
                        <Input
                          value={ruleForm.userAgent}
                          placeholder="Googlebot"
                          onChange={(e) => setRuleForm({ ...ruleForm, userAgent: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Crawl delay (seconds)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={ruleForm.crawlDelay}
                          placeholder="Not set"
                          onChange={(e) => setRuleForm({ ...ruleForm, crawlDelay: e.target.value })}
                        />
                      </div>
                    </div>

                    <StringListField
                      label="Allow paths"
                      values={ruleForm.allowPaths}
                      onChange={(values) => setRuleForm({ ...ruleForm, allowPaths: values })}
                      placeholder="/"
                      addLabel="Add allow path"
                    />

                    <StringListField
                      label="Disallow paths"
                      values={ruleForm.disallowPaths}
                      onChange={(values) => setRuleForm({ ...ruleForm, disallowPaths: values })}
                      placeholder="/admin"
                      addLabel="Add disallow path"
                    />

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        rows={2}
                        value={ruleForm.notes}
                        onChange={(e) => setRuleForm({ ...ruleForm, notes: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={ruleForm.isActive}
                        onCheckedChange={(value) => setRuleForm({ ...ruleForm, isActive: value })}
                      />
                      <Label>Rule is live</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setRuleId(null);
                          setRuleForm(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <SaveButton loading={rules.saving} label="Save rule" />
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="sitemap" className="mt-4 space-y-6">
            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Extra sitemap URLs</CardTitle>
                  <CardDescription>
                    Append URLs the generator cannot discover, such as landing pages hosted
                    elsewhere on the domain.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setEntryId("new");
                    setEntryForm({ ...emptyEntry });
                  }}
                >
                  <Plus className="size-4" />
                  Add URL
                </Button>
              </CardHeader>
              <CardContent>
                {entries.loading ? (
                  <div className="h-48 animate-pulse rounded-xl bg-muted" />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border/70">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>URL</TableHead>
                          <TableHead className="w-32">Frequency</TableHead>
                          <TableHead className="w-24">Priority</TableHead>
                          <TableHead className="w-28">Status</TableHead>
                          <TableHead className="w-20" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                              No manual URLs added.
                            </TableCell>
                          </TableRow>
                        ) : (
                          entries.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <button
                                  type="button"
                                  className="text-left font-mono text-xs hover:text-primary"
                                  onClick={() => {
                                    setEntryId(item.id);
                                    setEntryForm({
                                      url: item.url,
                                      changeFrequency: item.changeFrequency,
                                      priority: item.priority,
                                      lastModified: item.lastModified
                                        ? item.lastModified.slice(0, 10)
                                        : "",
                                      imageUrls: item.imageUrls,
                                      notes: item.notes,
                                      isActive: item.isActive,
                                    });
                                  }}
                                >
                                  {item.url}
                                </button>
                              </TableCell>
                              <TableCell className="text-xs">
                                {item.changeFrequency.toLowerCase()}
                              </TableCell>
                              <TableCell className="text-xs">{item.priority}</TableCell>
                              <TableCell>
                                <Badge variant={item.isActive ? "secondary" : "outline"}>
                                  {item.isActive ? "Live" : "Paused"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => void entries.remove(item.id)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
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

            {entryForm && entryId ? (
              <Card className="border-primary/40">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <CardTitle>{entryId === "new" ? "New sitemap URL" : "Edit sitemap URL"}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEntryId(null);
                      setEntryForm(null);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitEntry} className="space-y-4">
                    <div className="space-y-2">
                      <Label>URL or path</Label>
                      <Input
                        value={entryForm.url}
                        placeholder="/landing/gst-registration"
                        onChange={(e) => setEntryForm({ ...entryForm, url: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Change frequency</Label>
                        <Select
                          value={entryForm.changeFrequency}
                          onValueChange={(value) =>
                            value && setEntryForm({ ...entryForm, changeFrequency: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEO_CHANGE_FREQUENCIES.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option.toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min={0}
                          max={1}
                          value={entryForm.priority}
                          onChange={(e) =>
                            setEntryForm({ ...entryForm, priority: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last modified</Label>
                        <Input
                          type="date"
                          value={entryForm.lastModified}
                          onChange={(e) =>
                            setEntryForm({ ...entryForm, lastModified: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <StringListField
                      label="Image URLs"
                      values={entryForm.imageUrls}
                      onChange={(values) => setEntryForm({ ...entryForm, imageUrls: values })}
                      placeholder="/images/landing/gst.jpg"
                      addLabel="Add image"
                    />

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        rows={2}
                        value={entryForm.notes}
                        onChange={(e) => setEntryForm({ ...entryForm, notes: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={entryForm.isActive}
                        onCheckedChange={(value) => setEntryForm({ ...entryForm, isActive: value })}
                      />
                      <Label>Include in the sitemap</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEntryId(null);
                          setEntryForm(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <SaveButton loading={entries.saving} label="Save URL" />
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="files" className="mt-4 space-y-6">
            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Generated files</CardTitle>
                  <CardDescription>
                    Exactly what crawlers and language models receive right now.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={previewLoading}
                    onClick={() => void loadPreview("robots")}
                  >
                    <RefreshCw className="size-4" />
                    robots.txt
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={previewLoading}
                    onClick={() => void loadPreview("llms")}
                  >
                    <RefreshCw className="size-4" />
                    llms.txt
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {["/robots.txt", "/sitemap.xml", "/feed.xml", "/llms.txt", "/manifest.webmanifest"].map(
                    (href) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border/70 px-4 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                      >
                        {href}
                      </a>
                    ),
                  )}
                </div>
                {preview ? (
                  <div className="space-y-2">
                    <Label>{preview.kind === "robots" ? "robots.txt" : "llms.txt"}</Label>
                    <pre className="max-h-[420px] overflow-auto rounded-xl border border-border/70 bg-muted/30 p-4 font-mono text-xs whitespace-pre-wrap">
                      {preview.content}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Load a preview to inspect the generated output.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>IndexNow</CardTitle>
                <CardDescription>
                  Push updated URLs straight to Bing, Yandex and other IndexNow participants.
                  Enable it and set a key under Advanced in global settings first.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>URLs (one per line)</Label>
                  <Textarea
                    rows={6}
                    className="font-mono text-xs"
                    value={indexNowUrls}
                    placeholder={"/\n/blog/gst-return-due-dates"}
                    onChange={(event) => setIndexNowUrls(event.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="button" disabled={submitting} onClick={() => void submitIndexNow()}>
                    <Send className="size-4" />
                    {submitting ? "Submitting..." : "Submit to IndexNow"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
