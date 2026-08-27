"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { PairListField } from "@/components/admin/seo/pair-list-field";
import { SerpPreview } from "@/components/admin/seo/serp-preview";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { defaultSeoSettings } from "@/lib/seo/defaults";
import {
  AI_CRAWLER_AGENTS,
  SEO_CHANGE_FREQUENCIES,
  SEO_IMAGE_PREVIEWS,
  SEO_ORGANIZATION_TYPES,
  SEO_TWITTER_CARDS,
  type SeoSettingsContent,
} from "@/lib/seo/types";

type AdminUser = { name: string; email: string; role: "ADMIN" | "MANAGER" };

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const ORGANIZATION_LABELS: Record<(typeof SEO_ORGANIZATION_TYPES)[number], string> = {
  ORGANIZATION: "Organization — generic entity",
  LOCAL_BUSINESS: "LocalBusiness — physical premises",
  PROFESSIONAL_SERVICE: "ProfessionalService — advisory practice",
  ACCOUNTING_SERVICE: "AccountingService — CA / accounting firm",
  FINANCIAL_SERVICE: "FinancialService — finance provider",
  LEGAL_SERVICE: "LegalService — legal practice",
  CORPORATION: "Corporation — registered company",
  CONSULTING_AGENCY: "ConsultingAgency — consulting firm",
};

function toPairs(values: Array<{ hreflang: string; href: string }>) {
  return values.map((value) => ({ first: value.hreflang, second: value.href }));
}

function fromPairs(values: Array<{ first: string; second: string }>) {
  return values
    .filter((value) => value.first.trim() && value.second.trim())
    .map((value) => ({ hreflang: value.first.trim(), href: value.second.trim() }));
}

function toVerificationPairs(values: Array<{ name: string; content: string }>) {
  return values.map((value) => ({ first: value.name, second: value.content }));
}

function fromVerificationPairs(values: Array<{ first: string; second: string }>) {
  return values
    .filter((value) => value.first.trim() && value.second.trim())
    .map((value) => ({ name: value.first.trim(), content: value.second.trim() }));
}

export function SeoSettingsPageClient({ user }: { user: AdminUser }) {
  const [form, setForm] = useState<SeoSettingsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const response = await fetch("/api/admin/seo/settings");
        const data = await response.json();
        if (!active) return;
        setForm({ ...defaultSeoSettings, ...data.settings });
      } catch {
        if (active) toast.error("Failed to load SEO settings");
      } finally {
        if (active) setLoading(false);
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const previewUrl = useMemo(() => {
    if (!form) return "";
    return (form.canonicalHost || form.siteUrl).replace(/^https?:\/\//, "");
  }, [form]);

  function set<K extends keyof SeoSettingsContent>(key: K, value: SeoSettingsContent[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/seo/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setForm({ ...defaultSeoSettings, ...data.settings });
      toast.success("SEO settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setResetting(true);
    try {
      const response = await fetch("/api/admin/seo/settings", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Reset failed");
      setForm({ ...defaultSeoSettings, ...data.settings });
      toast.success("Settings restored to recommended defaults");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reset failed");
    } finally {
      setResetting(false);
    }
  }

  if (loading || !form) {
    return (
      <>
        <AdminHeader user={user} title="SEO & AEO" description="Global search and answer engine settings." />
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="SEO & AEO"
        description="Global search, social, structured data and answer engine settings."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>Global configuration</CardTitle>
                <CardDescription>
                  Every value here feeds the rendered meta tags, structured data, robots policy and
                  sitemap across the public site.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={form.indexingEnabled ? "secondary" : "destructive"}>
                  {form.indexingEnabled ? "Indexable" : "Blocked"}
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={resetting}
                  onClick={() => void handleReset()}
                >
                  <RefreshCw className="size-4" />
                  Restore defaults
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general">
                <TabsList className="flex h-auto flex-wrap">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="titles">Titles &amp; meta</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                  <TabsTrigger value="organization">Organization</TabsTrigger>
                  <TabsTrigger value="local">Local &amp; contact</TabsTrigger>
                  <TabsTrigger value="aeo">AEO</TabsTrigger>
                  <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
                  <TabsTrigger value="robots">Robots</TabsTrigger>
                  <TabsTrigger value="feeds">Feeds &amp; app</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-4 space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                    <Switch
                      checked={form.indexingEnabled}
                      onCheckedChange={(value) => set("indexingEnabled", value)}
                    />
                    <div>
                      <Label>Allow search engines to index this site</Label>
                      <p className="text-xs text-muted-foreground">
                        Turning this off serves a site-wide noindex and a blocking robots.txt.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Site name</Label>
                      <Input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Short name</Label>
                      <Input
                        value={form.siteShortName}
                        onChange={(e) => set("siteShortName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Production URL</Label>
                      <Input
                        value={form.siteUrl}
                        placeholder="https://www.carviassociates.com"
                        onChange={(e) => set("siteUrl", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Canonical host override</Label>
                      <Input
                        value={form.canonicalHost}
                        placeholder="Leave blank to use the production URL"
                        onChange={(e) => set("canonicalHost", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Language code</Label>
                      <Input
                        value={form.siteLanguage}
                        placeholder="en"
                        onChange={(e) => set("siteLanguage", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Locale</Label>
                      <Input
                        value={form.siteLocale}
                        placeholder="en_IN"
                        onChange={(e) => set("siteLocale", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Application name</Label>
                      <Input
                        value={form.applicationName}
                        onChange={(e) => set("applicationName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Publisher</Label>
                      <Input
                        value={form.publisherName}
                        onChange={(e) => set("publisherName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Default author</Label>
                      <Input
                        value={form.authorName}
                        onChange={(e) => set("authorName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content category</Label>
                      <Input
                        value={form.categoryMeta}
                        onChange={(e) => set("categoryMeta", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Referrer policy</Label>
                      <Input
                        value={form.referrerPolicy}
                        onChange={(e) => set("referrerPolicy", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Copyright line</Label>
                      <Input
                        value={form.copyrightText}
                        onChange={(e) => set("copyrightText", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Theme colour (light)</Label>
                      <Input
                        value={form.themeColorLight}
                        onChange={(e) => set("themeColorLight", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Theme colour (dark)</Label>
                      <Input
                        value={form.themeColorDark}
                        onChange={(e) => set("themeColorDark", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Favicon 32×32</Label>
                      <Input value={form.faviconUrl} onChange={(e) => set("faviconUrl", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Favicon 16×16</Label>
                      <Input
                        value={form.faviconSmallUrl}
                        onChange={(e) => set("faviconSmallUrl", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Apple touch icon</Label>
                      <Input
                        value={form.appleTouchIconUrl}
                        onChange={(e) => set("appleTouchIconUrl", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SVG icon</Label>
                      <Input value={form.svgIconUrl} onChange={(e) => set("svgIconUrl", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Safari mask icon</Label>
                      <Input value={form.maskIconUrl} onChange={(e) => set("maskIconUrl", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Mask icon colour</Label>
                      <Input
                        value={form.maskIconColor}
                        onChange={(e) => set("maskIconColor", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                    <Switch
                      checked={form.formatDetectionTelephone}
                      onCheckedChange={(value) => set("formatDetectionTelephone", value)}
                    />
                    <Label>Let browsers auto-link phone numbers</Label>
                  </div>
                </TabsContent>

                <TabsContent value="titles" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Default title</Label>
                    <Input
                      value={form.defaultTitle}
                      onChange={(e) => set("defaultTitle", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title template</Label>
                      <Input
                        value={form.titleTemplate}
                        placeholder="%s | Carvi Associates"
                        onChange={(e) => set("titleTemplate", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        %s is replaced by the page title. Skipped when the title already contains the
                        brand name.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={form.applyTitleTemplate}
                        onCheckedChange={(value) => set("applyTitleTemplate", value)}
                      />
                      <Label>Apply the template to inner pages</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Default meta description</Label>
                    <Textarea
                      rows={3}
                      value={form.defaultDescription}
                      onChange={(e) => set("defaultDescription", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default keywords</Label>
                    <Textarea
                      rows={2}
                      value={form.defaultKeywords}
                      onChange={(e) => set("defaultKeywords", e.target.value)}
                    />
                  </div>

                  <SerpPreview
                    url={previewUrl}
                    title={form.defaultTitle}
                    description={form.defaultDescription}
                  />

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Max snippet length</Label>
                      <Input
                        type="number"
                        min={-1}
                        value={form.maxSnippet}
                        onChange={(e) => set("maxSnippet", Number(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">-1 lets Google choose.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Max image preview</Label>
                      <Select
                        value={form.maxImagePreview}
                        onValueChange={(value) =>
                          value && set("maxImagePreview", value as SeoSettingsContent["maxImagePreview"])
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SEO_IMAGE_PREVIEWS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Max video preview (seconds)</Label>
                      <Input
                        type="number"
                        min={-1}
                        value={form.maxVideoPreview}
                        onChange={(e) => set("maxVideoPreview", Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {(
                      [
                        ["defaultNoIndex", "Site-wide noindex"],
                        ["defaultNoFollow", "Site-wide nofollow"],
                        ["defaultNoArchive", "Block cached copies (noarchive)"],
                        ["defaultNoSnippet", "Block text snippets (nosnippet)"],
                        ["defaultNoImageIndex", "Block image indexing"],
                      ] as const
                    ).map(([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3"
                      >
                        <Switch
                          checked={form[key]}
                          onCheckedChange={(value) => set(key, value)}
                        />
                        <Label>{label}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="social" className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Open Graph type</Label>
                      <Input value={form.ogType} onChange={(e) => set("ogType", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Open Graph site name</Label>
                      <Input value={form.ogSiteName} onChange={(e) => set("ogSiteName", e.target.value)} />
                    </div>
                  </div>

                  <ImageField
                    label="Default share image (1200×630)"
                    value={form.ogImageUrl}
                    onChange={(value) => set("ogImageUrl", value)}
                  />

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Share image alt text</Label>
                      <Input value={form.ogImageAlt} onChange={(e) => set("ogImageAlt", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Width</Label>
                      <Input
                        type="number"
                        value={form.ogImageWidth}
                        onChange={(e) => set("ogImageWidth", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Input
                        type="number"
                        value={form.ogImageHeight}
                        onChange={(e) => set("ogImageHeight", Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Twitter/X card type</Label>
                      <Select
                        value={form.twitterCard}
                        onValueChange={(value) =>
                          value && set("twitterCard", value as SeoSettingsContent["twitterCard"])
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SEO_TWITTER_CARDS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option.toLowerCase().replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Twitter/X image override</Label>
                      <Input
                        value={form.twitterImageUrl}
                        onChange={(e) => set("twitterImageUrl", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Site handle</Label>
                      <Input
                        value={form.twitterSite}
                        placeholder="@carviassociates"
                        onChange={(e) => set("twitterSite", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Creator handle</Label>
                      <Input
                        value={form.twitterCreator}
                        placeholder="@carviassociates"
                        onChange={(e) => set("twitterCreator", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Facebook app ID</Label>
                      <Input
                        value={form.facebookAppId}
                        onChange={(e) => set("facebookAppId", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Facebook page URL</Label>
                      <Input
                        value={form.facebookPageUrl}
                        onChange={(e) => set("facebookPageUrl", e.target.value)}
                      />
                    </div>
                  </div>

                  <StringListField
                    label="Social profiles (sameAs)"
                    values={form.sameAs}
                    onChange={(values) => set("sameAs", values)}
                    placeholder="https://www.linkedin.com/company/..."
                    hint="Linking every owned profile helps search engines consolidate the firm as one entity."
                    addLabel="Add profile"
                  />
                </TabsContent>

                <TabsContent value="verification" className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Google Search Console</Label>
                      <Input
                        value={form.googleSiteVerification}
                        placeholder="google-site-verification token"
                        onChange={(e) => set("googleSiteVerification", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bing Webmaster Tools</Label>
                      <Input
                        value={form.bingSiteVerification}
                        placeholder="msvalidate.01 token"
                        onChange={(e) => set("bingSiteVerification", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Yandex</Label>
                      <Input
                        value={form.yandexVerification}
                        onChange={(e) => set("yandexVerification", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Yahoo</Label>
                      <Input
                        value={form.yahooVerification}
                        onChange={(e) => set("yahooVerification", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pinterest</Label>
                      <Input
                        value={form.pinterestVerification}
                        onChange={(e) => set("pinterestVerification", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Facebook domain verification</Label>
                      <Input
                        value={form.facebookDomainVerification}
                        onChange={(e) => set("facebookDomainVerification", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Baidu</Label>
                      <Input
                        value={form.baiduVerification}
                        onChange={(e) => set("baiduVerification", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Norton Safe Web</Label>
                      <Input
                        value={form.nortonVerification}
                        onChange={(e) => set("nortonVerification", e.target.value)}
                      />
                    </div>
                  </div>

                  <PairListField
                    label="Custom verification meta tags"
                    values={toVerificationPairs(form.customVerifications)}
                    onChange={(values) => set("customVerifications", fromVerificationPairs(values))}
                    firstPlaceholder="meta name"
                    secondPlaceholder="content value"
                    hint="Rendered as <meta name=... content=... /> in the document head."
                    addLabel="Add meta tag"
                  />
                </TabsContent>

                <TabsContent value="organization" className="mt-4 space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                    <Switch
                      checked={form.organizationEnabled}
                      onCheckedChange={(value) => set("organizationEnabled", value)}
                    />
                    <div>
                      <Label>Publish organization structured data</Label>
                      <p className="text-xs text-muted-foreground">
                        Drives the Google knowledge panel and entity recognition in AI answers.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Schema type</Label>
                    <Select
                      value={form.organizationType}
                      onValueChange={(value) =>
                        value && set("organizationType", value as SeoSettingsContent["organizationType"])
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SEO_ORGANIZATION_TYPES.map((option) => (
                          <SelectItem key={option} value={option}>
                            {ORGANIZATION_LABELS[option]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Display name</Label>
                      <Input
                        value={form.organizationName}
                        onChange={(e) => set("organizationName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Legal name</Label>
                      <Input
                        value={form.organizationLegalName}
                        onChange={(e) => set("organizationLegalName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Alternate name</Label>
                      <Input
                        value={form.organizationAlternateName}
                        onChange={(e) => set("organizationAlternateName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slogan</Label>
                      <Input value={form.slogan} onChange={(e) => set("slogan", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Founding date</Label>
                      <Input
                        value={form.foundingDate}
                        placeholder="2015-04-01"
                        onChange={(e) => set("foundingDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Founder</Label>
                      <Input value={form.founderName} onChange={(e) => set("founderName", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Employees</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.numberOfEmployees ?? ""}
                        onChange={(e) =>
                          set("numberOfEmployees", e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Firm registration number</Label>
                      <Input
                        value={form.registrationNumber}
                        onChange={(e) => set("registrationNumber", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax ID (PAN)</Label>
                      <Input value={form.taxId} onChange={(e) => set("taxId", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>VAT / GSTIN</Label>
                      <Input value={form.vatId} onChange={(e) => set("vatId", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Organization description</Label>
                    <Textarea
                      rows={3}
                      value={form.organizationDescription}
                      onChange={(e) => set("organizationDescription", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <ImageField
                      label="Organization logo"
                      value={form.organizationLogoUrl}
                      onChange={(value) => set("organizationLogoUrl", value)}
                    />
                    <ImageField
                      label="Organization photo"
                      value={form.organizationImageUrl}
                      onChange={(value) => set("organizationImageUrl", value)}
                    />
                  </div>

                  <StringListField
                    label="Expertise (knowsAbout)"
                    values={form.knowsAbout}
                    onChange={(values) => set("knowsAbout", values)}
                    placeholder="Statutory Audit"
                    hint="Topic entities the firm is authoritative on — used heavily by answer engines."
                    addLabel="Add topic"
                  />

                  <StringListField
                    label="Awards and recognition"
                    values={form.awards}
                    onChange={(values) => set("awards", values)}
                    placeholder="Best Emerging CA Firm 2024"
                    addLabel="Add award"
                  />

                  <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                    <Switch
                      checked={form.aggregateRatingEnabled}
                      onCheckedChange={(value) => set("aggregateRatingEnabled", value)}
                    />
                    <div>
                      <Label>Publish aggregate rating</Label>
                      <p className="text-xs text-muted-foreground">
                        Only enable when the ratings are genuine and visible on the site.
                      </p>
                    </div>
                  </div>

                  {form.aggregateRatingEnabled ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Rating value</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min={0}
                          max={5}
                          value={form.ratingValue}
                          onChange={(e) => set("ratingValue", Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Review count</Label>
                        <Input
                          type="number"
                          min={0}
                          value={form.reviewCount}
                          onChange={(e) => set("reviewCount", Number(e.target.value))}
                        />
                      </div>
                    </div>
                  ) : null}
                </TabsContent>

                <TabsContent value="local" className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Contact email</Label>
                      <Input
                        value={form.contactEmail}
                        onChange={(e) => set("contactEmail", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact phone</Label>
                      <Input
                        value={form.contactPhone}
                        placeholder="+91 98765 43210"
                        onChange={(e) => set("contactPhone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fax</Label>
                      <Input value={form.faxNumber} onChange={(e) => set("faxNumber", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Price range</Label>
                      <Input value={form.priceRange} onChange={(e) => set("priceRange", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Currencies accepted</Label>
                      <Input
                        value={form.currenciesAccepted}
                        onChange={(e) => set("currenciesAccepted", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment methods</Label>
                      <Input
                        value={form.paymentAccepted}
                        onChange={(e) => set("paymentAccepted", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Street address</Label>
                      <Input
                        value={form.streetAddress}
                        onChange={(e) => set("streetAddress", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={form.addressLocality}
                        onChange={(e) => set("addressLocality", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State / region</Label>
                      <Input
                        value={form.addressRegion}
                        onChange={(e) => set("addressRegion", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Postal code</Label>
                      <Input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Country code</Label>
                      <Input
                        value={form.addressCountry}
                        placeholder="IN"
                        onChange={(e) => set("addressCountry", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Latitude</Label>
                      <Input value={form.latitude} onChange={(e) => set("latitude", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude</Label>
                      <Input value={form.longitude} onChange={(e) => set("longitude", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Google Maps link</Label>
                      <Input value={form.hasMapUrl} onChange={(e) => set("hasMapUrl", e.target.value)} />
                    </div>
                  </div>

                  <StringListField
                    label="Areas served"
                    values={form.areaServed}
                    onChange={(values) => set("areaServed", values)}
                    placeholder="Mumbai"
                    addLabel="Add area"
                  />

                  <div className="space-y-3">
                    <Label>Opening hours</Label>
                    <div className="space-y-3">
                      {form.openingHours.map((entry, index) => (
                        <div
                          key={index}
                          className="space-y-3 rounded-xl border border-border/70 p-4"
                        >
                          <div className="flex flex-wrap gap-2">
                            {WEEK_DAYS.map((day) => {
                              const active = entry.days.includes(day);
                              return (
                                <Button
                                  key={day}
                                  type="button"
                                  size="sm"
                                  variant={active ? "default" : "outline"}
                                  onClick={() => {
                                    const next = [...form.openingHours];
                                    next[index] = {
                                      ...entry,
                                      days: active
                                        ? entry.days.filter((value) => value !== day)
                                        : [...entry.days, day],
                                    };
                                    set("openingHours", next);
                                  }}
                                >
                                  {day.slice(0, 3)}
                                </Button>
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap items-end gap-3">
                            <div className="space-y-2">
                              <Label>Opens</Label>
                              <Input
                                type="time"
                                value={entry.opens}
                                onChange={(e) => {
                                  const next = [...form.openingHours];
                                  next[index] = { ...entry, opens: e.target.value };
                                  set("openingHours", next);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Closes</Label>
                              <Input
                                type="time"
                                value={entry.closes}
                                onChange={(e) => {
                                  const next = [...form.openingHours];
                                  next[index] = { ...entry, closes: e.target.value };
                                  set("openingHours", next);
                                }}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() =>
                                set(
                                  "openingHours",
                                  form.openingHours.filter((_, rowIndex) => rowIndex !== index),
                                )
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        set("openingHours", [
                          ...form.openingHours,
                          { days: ["Monday"], opens: "10:00", closes: "19:00" },
                        ])
                      }
                    >
                      Add opening hours
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label>Contact points</Label>
                    <div className="space-y-3">
                      {form.contactPoints.map((point, index) => (
                        <div
                          key={index}
                          className="grid gap-3 rounded-xl border border-border/70 p-4 md:grid-cols-2"
                        >
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Input
                              value={point.contactType}
                              placeholder="customer support"
                              onChange={(e) => {
                                const next = [...form.contactPoints];
                                next[index] = { ...point, contactType: e.target.value };
                                set("contactPoints", next);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Telephone</Label>
                            <Input
                              value={point.telephone}
                              onChange={(e) => {
                                const next = [...form.contactPoints];
                                next[index] = { ...point, telephone: e.target.value };
                                set("contactPoints", next);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                              value={point.email}
                              onChange={(e) => {
                                const next = [...form.contactPoints];
                                next[index] = { ...point, email: e.target.value };
                                set("contactPoints", next);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Area served</Label>
                            <Input
                              value={point.areaServed}
                              onChange={(e) => {
                                const next = [...form.contactPoints];
                                next[index] = { ...point, areaServed: e.target.value };
                                set("contactPoints", next);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Languages</Label>
                            <Input
                              value={point.availableLanguage}
                              placeholder="English, Hindi"
                              onChange={(e) => {
                                const next = [...form.contactPoints];
                                next[index] = { ...point, availableLanguage: e.target.value };
                                set("contactPoints", next);
                              }}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() =>
                                set(
                                  "contactPoints",
                                  form.contactPoints.filter((_, rowIndex) => rowIndex !== index),
                                )
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        set("contactPoints", [
                          ...form.contactPoints,
                          {
                            contactType: "customer support",
                            telephone: form.contactPhone,
                            email: form.contactEmail,
                            areaServed: "IN",
                            availableLanguage: "English, Hindi",
                          },
                        ])
                      }
                    >
                      Add contact point
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="aeo" className="mt-4 space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    {(
                      [
                        ["aeoEnabled", "Answer engine optimisation"],
                        ["speakableEnabled", "Speakable markup for voice assistants"],
                        ["faqSchemaEnabled", "FAQPage structured data"],
                        ["qaPageEnabled", "QAPage structured data"],
                        ["websiteSchemaEnabled", "WebSite structured data"],
                        ["webPageSchemaEnabled", "WebPage structured data"],
                        ["breadcrumbsEnabled", "BreadcrumbList structured data"],
                        ["searchboxEnabled", "Sitelinks search box"],
                        ["llmsTxtEnabled", "Publish /llms.txt"],
                        ["llmsTxtAutoGenerate", "Generate llms.txt from live content"],
                      ] as const
                    ).map(([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3"
                      >
                        <Switch checked={form[key]} onCheckedChange={(value) => set(key, value)} />
                        <Label>{label}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Search URL template</Label>
                    <Input
                      value={form.searchUrlTemplate}
                      placeholder="/blog?q={search_term_string}"
                      onChange={(e) => set("searchUrlTemplate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Entity summary for AI answers</Label>
                    <Textarea
                      rows={3}
                      value={form.aiSummary}
                      onChange={(e) => set("aiSummary", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      A single self-contained paragraph an assistant can quote verbatim.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Entity definition</Label>
                    <Textarea
                      rows={2}
                      value={form.entityDefinition}
                      onChange={(e) => set("entityDefinition", e.target.value)}
                    />
                  </div>

                  <StringListField
                    label="Questions this site should answer"
                    values={form.aiAnswerTargets}
                    onChange={(values) => set("aiAnswerTargets", values)}
                    placeholder="Who is the best CA firm for GST filing in Mumbai?"
                    hint="Published in llms.txt so answer engines know what the site covers."
                    addLabel="Add question"
                  />

                  <StringListField
                    label="Speakable CSS selectors"
                    values={form.speakableSelectors}
                    onChange={(values) => set("speakableSelectors", values)}
                    placeholder="h1"
                    hint="Voice assistants read the text inside these selectors."
                    addLabel="Add selector"
                  />

                  <div className="space-y-2">
                    <Label>Extra llms.txt content</Label>
                    <Textarea
                      rows={6}
                      value={form.llmsTxtContent}
                      placeholder="Markdown appended to the generated file, or the full file when auto-generation is off."
                      onChange={(e) => set("llmsTxtContent", e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="sitemap" className="mt-4 space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    {(
                      [
                        ["sitemapEnabled", "Generate /sitemap.xml"],
                        ["sitemapIncludeImages", "Include image entries"],
                        ["sitemapIncludePages", "Include managed routes"],
                        ["sitemapIncludeBlog", "Include blog articles"],
                        ["sitemapIncludeCategories", "Include blog categories"],
                        ["sitemapIncludeTags", "Include blog tags"],
                        ["sitemapIncludeAuthors", "Include author archives"],
                        ["sitemapIncludeServices", "Include service pages"],
                      ] as const
                    ).map(([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3"
                      >
                        <Switch checked={form[key]} onCheckedChange={(value) => set(key, value)} />
                        <Label>{label}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Default change frequency</Label>
                      <Select
                        value={form.sitemapDefaultChangeFreq}
                        onValueChange={(value) =>
                          value &&
                          set(
                            "sitemapDefaultChangeFreq",
                            value as SeoSettingsContent["sitemapDefaultChangeFreq"],
                          )
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
                      <Label>Maximum URLs</Label>
                      <Input
                        type="number"
                        min={100}
                        max={50000}
                        value={form.sitemapMaxUrls}
                        onChange={(e) => set("sitemapMaxUrls", Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {(
                      [
                        ["sitemapHomePriority", "Homepage priority"],
                        ["sitemapPagePriority", "Page priority"],
                        ["sitemapBlogPriority", "Blog index priority"],
                        ["sitemapPostPriority", "Article priority"],
                        ["sitemapServicePriority", "Service priority"],
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key} className="space-y-2">
                        <Label>{label}</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min={0}
                          max={1}
                          value={form[key]}
                          onChange={(e) => set(key, Number(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="robots" className="mt-4 space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={form.robotsEnabled}
                        onCheckedChange={(value) => set("robotsEnabled", value)}
                      />
                      <Label>Serve robots.txt</Label>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={form.robotsUseCustom}
                        onCheckedChange={(value) => set("robotsUseCustom", value)}
                      />
                      <Label>Replace generated rules with custom text</Label>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={form.blockAiCrawlers}
                        onCheckedChange={(value) => set("blockAiCrawlers", value)}
                      />
                      <div>
                        <Label>Block AI training crawlers</Label>
                        <p className="text-xs text-muted-foreground">
                          Blocking reduces AI citation reach — leave off unless content must stay out
                          of model training.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Crawl delay (seconds)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.robotsCrawlDelay ?? ""}
                        placeholder="Not set"
                        onChange={(e) =>
                          set("robotsCrawlDelay", e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </div>
                  </div>

                  {form.blockAiCrawlers ? (
                    <div className="space-y-2 rounded-xl border border-border/70 p-4">
                      <Label>Crawlers to keep allowed</Label>
                      <div className="flex flex-wrap gap-2">
                        {AI_CRAWLER_AGENTS.map((agent) => {
                          const active = form.allowedAiCrawlers.includes(agent);
                          return (
                            <Button
                              key={agent}
                              type="button"
                              size="sm"
                              variant={active ? "default" : "outline"}
                              onClick={() =>
                                set(
                                  "allowedAiCrawlers",
                                  active
                                    ? form.allowedAiCrawlers.filter((value) => value !== agent)
                                    : [...form.allowedAiCrawlers, agent],
                                )
                              }
                            >
                              {agent}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <Label>Host directive</Label>
                    <Input
                      value={form.robotsHost}
                      placeholder="www.carviassociates.com"
                      onChange={(e) => set("robotsHost", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Additional robots.txt lines</Label>
                    <Textarea
                      rows={4}
                      value={form.robotsExtraLines}
                      onChange={(e) => set("robotsExtraLines", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Custom robots.txt</Label>
                    <Textarea
                      rows={10}
                      className="font-mono text-xs"
                      value={form.robotsCustomContent}
                      onChange={(e) => set("robotsCustomContent", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Used verbatim when &ldquo;Replace generated rules&rdquo; is enabled.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="feeds" className="mt-4 space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={form.rssEnabled}
                        onCheckedChange={(value) => set("rssEnabled", value)}
                      />
                      <Label>Publish RSS feed at /feed.xml</Label>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={form.manifestEnabled}
                        onCheckedChange={(value) => set("manifestEnabled", value)}
                      />
                      <Label>Publish web app manifest</Label>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Feed title</Label>
                      <Input value={form.rssTitle} onChange={(e) => set("rssTitle", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Feed item limit</Label>
                      <Input
                        type="number"
                        min={1}
                        max={200}
                        value={form.rssItemLimit}
                        onChange={(e) => set("rssItemLimit", Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Feed description</Label>
                    <Textarea
                      rows={2}
                      value={form.rssDescription}
                      onChange={(e) => set("rssDescription", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Manifest name</Label>
                      <Input
                        value={form.manifestName}
                        onChange={(e) => set("manifestName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Manifest short name</Label>
                      <Input
                        value={form.manifestShortName}
                        onChange={(e) => set("manifestShortName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Display mode</Label>
                      <Input
                        value={form.manifestDisplay}
                        placeholder="standalone"
                        onChange={(e) => set("manifestDisplay", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start URL</Label>
                      <Input
                        value={form.manifestStartUrl}
                        onChange={(e) => set("manifestStartUrl", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Background colour</Label>
                      <Input
                        value={form.manifestBackgroundColor}
                        onChange={(e) => set("manifestBackgroundColor", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Manifest description</Label>
                    <Textarea
                      rows={2}
                      value={form.manifestDescription}
                      onChange={(e) => set("manifestDescription", e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="mt-4 space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={form.redirectsEnabled}
                        onCheckedChange={(value) => set("redirectsEnabled", value)}
                      />
                      <Label>Apply managed redirects</Label>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={form.forceTrailingSlash}
                        onCheckedChange={(value) => set("forceTrailingSlash", value)}
                      />
                      <Label>Canonical URLs end with a slash</Label>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={form.hreflangEnabled}
                        onCheckedChange={(value) => set("hreflangEnabled", value)}
                      />
                      <Label>Publish hreflang alternates</Label>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                      <Switch
                        checked={form.indexNowEnabled}
                        onCheckedChange={(value) => set("indexNowEnabled", value)}
                      />
                      <Label>Enable IndexNow submissions</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>IndexNow key</Label>
                    <Input
                      value={form.indexNowKey}
                      placeholder="32-character hexadecimal key"
                      onChange={(e) => set("indexNowKey", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Served at /indexnow-key.txt so Bing and Yandex can verify ownership.
                    </p>
                  </div>

                  <StringListField
                    label="Alternate locales"
                    values={form.alternateLocales}
                    onChange={(values) => set("alternateLocales", values)}
                    placeholder="hi_IN"
                    addLabel="Add locale"
                  />

                  <PairListField
                    label="Hreflang alternates"
                    values={toPairs(form.hreflangEntries)}
                    onChange={(values) => set("hreflangEntries", fromPairs(values))}
                    firstPlaceholder="en-IN"
                    secondPlaceholder="/"
                    addLabel="Add alternate"
                  />

                  <StringListField
                    label="Preconnect origins"
                    values={form.preconnectUrls}
                    onChange={(values) => set("preconnectUrls", values)}
                    placeholder="https://fonts.gstatic.com"
                    addLabel="Add origin"
                  />

                  <StringListField
                    label="DNS prefetch origins"
                    values={form.dnsPrefetchUrls}
                    onChange={(values) => set("dnsPrefetchUrls", values)}
                    placeholder="https://res.cloudinary.com"
                    addLabel="Add origin"
                  />

                  <div className="space-y-2">
                    <Label>Custom head HTML</Label>
                    <Textarea
                      rows={5}
                      className="font-mono text-xs"
                      value={form.customHeadHtml}
                      onChange={(e) => set("customHeadHtml", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custom HTML after &lt;body&gt;</Label>
                    <Textarea
                      rows={4}
                      className="font-mono text-xs"
                      value={form.customBodyStartHtml}
                      onChange={(e) => set("customBodyStartHtml", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custom HTML before &lt;/body&gt;</Label>
                    <Textarea
                      rows={4}
                      className="font-mono text-xs"
                      value={form.customBodyEndHtml}
                      onChange={(e) => set("customBodyEndHtml", e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-end">
                <SaveButton loading={saving} label="Save SEO settings" />
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </>
  );
}
