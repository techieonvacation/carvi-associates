"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { SaveButton } from "@/components/admin/save-button";
import { PairListField } from "@/components/admin/seo/pair-list-field";
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
  SEO_CONSENT_CATEGORIES,
  SEO_INTEGRATION_PROVIDERS,
  SEO_PROVIDER_META,
  SEO_SCRIPT_PLACEMENTS,
  SEO_SCRIPT_SCOPES,
  SEO_SCRIPT_STRATEGIES,
  type SeoIntegrationItem,
  type SeoIntegrationProvider,
  type SeoScriptItem,
} from "@/lib/seo/types";

type AdminUser = { name: string; email: string; role: "ADMIN" | "MANAGER" };

type IntegrationForm = {
  provider: SeoIntegrationProvider;
  label: string;
  trackingId: string;
  secondaryId: string;
  notes: string;
  isActive: boolean;
  anonymizeIp: boolean;
  webvisor: boolean;
};

type ScriptForm = {
  name: string;
  description: string;
  placement: string;
  strategy: string;
  scriptSrc: string;
  inlineCode: string;
  scriptType: string;
  isAsync: boolean;
  isDefer: boolean;
  attributes: Array<{ name: string; value: string }>;
  scope: string;
  pathPatterns: string[];
  consentCategory: string;
  isActive: boolean;
};

const emptyIntegration: IntegrationForm = {
  provider: "GOOGLE_ANALYTICS",
  label: "",
  trackingId: "",
  secondaryId: "",
  notes: "",
  isActive: true,
  anonymizeIp: true,
  webvisor: true,
};

const emptyScript: ScriptForm = {
  name: "",
  description: "",
  placement: "HEAD",
  strategy: "AFTER_INTERACTIVE",
  scriptSrc: "",
  inlineCode: "",
  scriptType: "",
  isAsync: false,
  isDefer: false,
  attributes: [],
  scope: "ALL",
  pathPatterns: [],
  consentCategory: "ANALYTICS",
  isActive: true,
};

const PLACEMENT_LABELS: Record<string, string> = {
  HEAD: "Document head",
  BODY_START: "After <body>",
  BODY_END: "Before </body>",
};

const STRATEGY_LABELS: Record<string, string> = {
  BEFORE_INTERACTIVE: "Before interactive — blocking, use sparingly",
  AFTER_INTERACTIVE: "After interactive — recommended for analytics",
  LAZY_ONLOAD: "Lazy on load — chat widgets, heatmaps",
  WORKER: "Web worker — offloaded",
};

export function SeoScriptsPageClient({ user }: { user: AdminUser }) {
  const integrations = useSeoCollection<SeoIntegrationItem, Record<string, unknown>>({
    resource: "integrations",
    collectionKey: "integrations",
    itemKey: "integration",
    label: "Integration",
  });
  const scripts = useSeoCollection<SeoScriptItem, Record<string, unknown>>({
    resource: "scripts",
    collectionKey: "scripts",
    itemKey: "script",
    label: "Script",
  });

  const [integrationId, setIntegrationId] = useState<string | null>(null);
  const [integrationForm, setIntegrationForm] = useState<IntegrationForm | null>(null);
  const [scriptId, setScriptId] = useState<string | null>(null);
  const [scriptForm, setScriptForm] = useState<ScriptForm | null>(null);

  const providerMeta = useMemo(
    () => (integrationForm ? SEO_PROVIDER_META[integrationForm.provider] : null),
    [integrationForm],
  );

  function startIntegration(item?: SeoIntegrationItem) {
    if (item) {
      setIntegrationId(item.id);
      setIntegrationForm({
        provider: item.provider,
        label: item.label,
        trackingId: item.trackingId,
        secondaryId: item.secondaryId,
        notes: item.notes,
        isActive: item.isActive,
        anonymizeIp: item.config.anonymizeIp !== false,
        webvisor: item.config.webvisor !== false,
      });
    } else {
      setIntegrationId("new");
      setIntegrationForm({ ...emptyIntegration });
    }
  }

  function startScript(item?: SeoScriptItem) {
    if (item) {
      setScriptId(item.id);
      setScriptForm({
        name: item.name,
        description: item.description,
        placement: item.placement,
        strategy: item.strategy,
        scriptSrc: item.scriptSrc,
        inlineCode: item.inlineCode,
        scriptType: item.scriptType,
        isAsync: item.isAsync,
        isDefer: item.isDefer,
        attributes: item.attributes,
        scope: item.scope,
        pathPatterns: item.pathPatterns,
        consentCategory: item.consentCategory,
        isActive: item.isActive,
      });
    } else {
      setScriptId("new");
      setScriptForm({ ...emptyScript });
    }
  }

  async function submitIntegration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!integrationForm) return;

    const payload = {
      provider: integrationForm.provider,
      label: integrationForm.label,
      trackingId: integrationForm.trackingId,
      secondaryId: integrationForm.secondaryId,
      notes: integrationForm.notes,
      isActive: integrationForm.isActive,
      config: {
        anonymizeIp: integrationForm.anonymizeIp,
        webvisor: integrationForm.webvisor,
      },
    };

    const ok =
      integrationId === "new"
        ? await integrations.create(payload)
        : await integrations.update(integrationId as string, payload);

    if (ok) {
      setIntegrationId(null);
      setIntegrationForm(null);
    }
  }

  async function submitScript(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!scriptForm) return;

    const payload = {
      ...scriptForm,
      pathPatterns: scriptForm.pathPatterns.filter(Boolean),
      attributes: scriptForm.attributes.filter((attribute) => attribute.name.trim()),
    };

    const ok =
      scriptId === "new"
        ? await scripts.create(payload)
        : await scripts.update(scriptId as string, payload);

    if (ok) {
      setScriptId(null);
      setScriptForm(null);
    }
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Tracking & scripts"
        description="Google, Bing, advertising pixels, experience tools and any custom tag."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Tabs defaultValue="integrations">
          <TabsList>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="scripts">Custom scripts</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="mt-4 space-y-6">
            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Connected platforms</CardTitle>
                  <CardDescription>
                    Add a tracking ID and the correct snippet is generated, loaded with the right
                    strategy and given its noscript fallback.
                  </CardDescription>
                </div>
                <Button type="button" onClick={() => startIntegration()}>
                  <Plus className="size-4" />
                  Add integration
                </Button>
              </CardHeader>
              <CardContent>
                {integrations.loading ? (
                  <div className="h-48 animate-pulse rounded-xl bg-muted" />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border/70">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Platform</TableHead>
                          <TableHead>Identifier</TableHead>
                          <TableHead className="w-32">Group</TableHead>
                          <TableHead className="w-28">Status</TableHead>
                          <TableHead className="w-20" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {integrations.items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                              No platforms connected. Start with Google Analytics and Search Console.
                            </TableCell>
                          </TableRow>
                        ) : (
                          integrations.items.map((item) => {
                            const meta = SEO_PROVIDER_META[item.provider];
                            return (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <button
                                    type="button"
                                    className="text-left font-medium hover:text-accent dark:hover:text-primary"
                                    onClick={() => startIntegration(item)}
                                  >
                                    {item.label || meta.label}
                                  </button>
                                  <p className="text-xs text-muted-foreground">{meta.description}</p>
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {item.trackingId || "—"}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{meta.group}</Badge>
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
                                    onClick={() => void integrations.remove(item.id)}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {integrations.trashed.length ? (
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Trash</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {integrations.trashed.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3"
                    >
                      <p className="font-medium">
                        {item.label || SEO_PROVIDER_META[item.provider].label}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => void integrations.bulk([item.id], "restore")}
                        >
                          <RotateCcw className="size-4" />
                          Restore
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => void integrations.remove(item.id, true)}
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

            {integrationForm && integrationId ? (
              <Card className="border-primary/40">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle>
                      {integrationId === "new" ? "Add integration" : "Edit integration"}
                    </CardTitle>
                    {providerMeta?.helpUrl ? (
                      <CardDescription>
                        <a
                          href={providerMeta.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-accent dark:hover:text-primary"
                        >
                          Open {providerMeta.label} console
                          <ExternalLink className="size-3" />
                        </a>
                      </CardDescription>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIntegrationId(null);
                      setIntegrationForm(null);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitIntegration} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Platform</Label>
                        <Select
                          value={integrationForm.provider}
                          onValueChange={(value) =>
                            value &&
                            setIntegrationForm({
                              ...integrationForm,
                              provider: value as SeoIntegrationProvider,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEO_INTEGRATION_PROVIDERS.map((provider) => (
                              <SelectItem key={provider} value={provider}>
                                {SEO_PROVIDER_META[provider].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Internal label</Label>
                        <Input
                          value={integrationForm.label}
                          placeholder={providerMeta?.label}
                          onChange={(e) =>
                            setIntegrationForm({ ...integrationForm, label: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{providerMeta?.idLabel ?? "Identifier"}</Label>
                        <Input
                          value={integrationForm.trackingId}
                          placeholder={providerMeta?.idPlaceholder}
                          onChange={(e) =>
                            setIntegrationForm({ ...integrationForm, trackingId: e.target.value })
                          }
                        />
                      </div>
                      {providerMeta?.secondaryLabel ? (
                        <div className="space-y-2">
                          <Label>{providerMeta.secondaryLabel}</Label>
                          <Input
                            value={integrationForm.secondaryId}
                            placeholder={providerMeta.secondaryPlaceholder}
                            onChange={(e) =>
                              setIntegrationForm({ ...integrationForm, secondaryId: e.target.value })
                            }
                          />
                        </div>
                      ) : null}
                    </div>

                    {integrationForm.provider === "GOOGLE_ANALYTICS" ? (
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={integrationForm.anonymizeIp}
                          onCheckedChange={(value) =>
                            setIntegrationForm({ ...integrationForm, anonymizeIp: value })
                          }
                        />
                        <Label>Anonymise visitor IP addresses</Label>
                      </div>
                    ) : null}

                    {integrationForm.provider === "YANDEX_METRICA" ? (
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={integrationForm.webvisor}
                          onCheckedChange={(value) =>
                            setIntegrationForm({ ...integrationForm, webvisor: value })
                          }
                        />
                        <Label>Enable Webvisor session recording</Label>
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        rows={2}
                        value={integrationForm.notes}
                        onChange={(e) =>
                          setIntegrationForm({ ...integrationForm, notes: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={integrationForm.isActive}
                        onCheckedChange={(value) =>
                          setIntegrationForm({ ...integrationForm, isActive: value })
                        }
                      />
                      <Label>Load this integration on the public site</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIntegrationId(null);
                          setIntegrationForm(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <SaveButton loading={integrations.saving} label="Save integration" />
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="scripts" className="mt-4 space-y-6">
            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Custom scripts</CardTitle>
                  <CardDescription>
                    Inject any external or inline script with full control over placement, loading
                    strategy and which routes it runs on.
                  </CardDescription>
                </div>
                <Button type="button" onClick={() => startScript()}>
                  <Plus className="size-4" />
                  Add script
                </Button>
              </CardHeader>
              <CardContent>
                {scripts.loading ? (
                  <div className="h-48 animate-pulse rounded-xl bg-muted" />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border/70">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-40">Placement</TableHead>
                          <TableHead className="w-40">Scope</TableHead>
                          <TableHead className="w-28">Status</TableHead>
                          <TableHead className="w-20" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scripts.items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                              No custom scripts yet.
                            </TableCell>
                          </TableRow>
                        ) : (
                          scripts.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <button
                                  type="button"
                                  className="text-left font-medium hover:text-accent dark:hover:text-primary"
                                  onClick={() => startScript(item)}
                                >
                                  {item.name}
                                </button>
                                <p className="text-xs text-muted-foreground">
                                  {item.description || (item.scriptSrc ? item.scriptSrc : "Inline snippet")}
                                </p>
                              </TableCell>
                              <TableCell>{PLACEMENT_LABELS[item.placement]}</TableCell>
                              <TableCell>
                                {item.scope === "ALL"
                                  ? "All pages"
                                  : `${item.scope === "INCLUDE" ? "Only" : "Except"} ${item.pathPatterns.length} path${item.pathPatterns.length === 1 ? "" : "s"}`}
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
                                  onClick={() => void scripts.remove(item.id)}
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

            {scripts.trashed.length ? (
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Trash</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {scripts.trashed.map((item) => (
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
                          onClick={() => void scripts.bulk([item.id], "restore")}
                        >
                          <RotateCcw className="size-4" />
                          Restore
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => void scripts.remove(item.id, true)}
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

            {scriptForm && scriptId ? (
              <Card className="border-primary/40">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <CardTitle>{scriptId === "new" ? "Add script" : "Edit script"}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setScriptId(null);
                      setScriptForm(null);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitScript} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={scriptForm.name}
                          onChange={(e) => setScriptForm({ ...scriptForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={scriptForm.description}
                          onChange={(e) =>
                            setScriptForm({ ...scriptForm, description: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Placement</Label>
                        <Select
                          value={scriptForm.placement}
                          onValueChange={(value) =>
                            value && setScriptForm({ ...scriptForm, placement: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEO_SCRIPT_PLACEMENTS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {PLACEMENT_LABELS[option]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Loading strategy</Label>
                        <Select
                          value={scriptForm.strategy}
                          onValueChange={(value) =>
                            value && setScriptForm({ ...scriptForm, strategy: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEO_SCRIPT_STRATEGIES.map((option) => (
                              <SelectItem key={option} value={option}>
                                {STRATEGY_LABELS[option]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>External script URL</Label>
                      <Input
                        value={scriptForm.scriptSrc}
                        placeholder="https://cdn.example.com/tag.js"
                        onChange={(e) => setScriptForm({ ...scriptForm, scriptSrc: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Inline code</Label>
                      <Textarea
                        rows={8}
                        className="font-mono text-xs"
                        value={scriptForm.inlineCode}
                        placeholder="window.dataLayer = window.dataLayer || [];"
                        onChange={(e) => setScriptForm({ ...scriptForm, inlineCode: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Provide a URL, inline code, or both. Do not include the surrounding script tag.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Script type attribute</Label>
                        <Input
                          value={scriptForm.scriptType}
                          placeholder="text/partytown"
                          onChange={(e) =>
                            setScriptForm({ ...scriptForm, scriptType: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Consent category</Label>
                        <Select
                          value={scriptForm.consentCategory}
                          onValueChange={(value) =>
                            value && setScriptForm({ ...scriptForm, consentCategory: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEO_CONSENT_CATEGORIES.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option.toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={scriptForm.isAsync}
                          onCheckedChange={(value) => setScriptForm({ ...scriptForm, isAsync: value })}
                        />
                        <Label>async</Label>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={scriptForm.isDefer}
                          onCheckedChange={(value) => setScriptForm({ ...scriptForm, isDefer: value })}
                        />
                        <Label>defer</Label>
                      </div>
                    </div>

                    <PairListField
                      label="Extra attributes"
                      values={scriptForm.attributes.map((attribute) => ({
                        first: attribute.name,
                        second: attribute.value,
                      }))}
                      onChange={(values) =>
                        setScriptForm({
                          ...scriptForm,
                          attributes: values.map((value) => ({
                            name: value.first,
                            value: value.second,
                          })),
                        })
                      }
                      firstPlaceholder="data-domain"
                      secondPlaceholder="carviassociates.com"
                      addLabel="Add attribute"
                    />

                    <div className="space-y-2">
                      <Label>Where should it load?</Label>
                      <Select
                        value={scriptForm.scope}
                        onValueChange={(value) => value && setScriptForm({ ...scriptForm, scope: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SEO_SCRIPT_SCOPES.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option === "ALL"
                                ? "Every page"
                                : option === "INCLUDE"
                                  ? "Only the listed paths"
                                  : "Every page except the listed paths"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {scriptForm.scope !== "ALL" ? (
                      <StringListField
                        label="Path patterns"
                        values={scriptForm.pathPatterns}
                        onChange={(values) => setScriptForm({ ...scriptForm, pathPatterns: values })}
                        placeholder="/blog*"
                        hint="Use a trailing * to match a prefix."
                        addLabel="Add path"
                      />
                    ) : null}

                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={scriptForm.isActive}
                        onCheckedChange={(value) => setScriptForm({ ...scriptForm, isActive: value })}
                      />
                      <Label>Script is live</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setScriptId(null);
                          setScriptForm(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <SaveButton loading={scripts.saving} label="Save script" />
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
