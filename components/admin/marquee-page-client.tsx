"use client";

import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  Plus,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { ColorField } from "@/components/admin/color-field";
import { ImageField } from "@/components/admin/image-field";
import { SaveButton } from "@/components/admin/save-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  MarqueeBandTarget,
  MarqueeContent,
  MarqueeItemData,
  MarqueeItemKind,
} from "@/lib/cms/types";

type SettingsForm = Omit<MarqueeContent, "items">;

type MarqueePageProps = {
  user: { name: string; email: string; role: "ADMIN" | "MANAGER" };
};

const KIND_LABELS: Record<MarqueeItemKind, string> = {
  TEXT: "Text only",
  IMAGE: "Image only",
  TEXT_IMAGE: "Image + text",
};

const BAND_LABELS: Record<MarqueeBandTarget, string> = {
  ONE: "Band one",
  TWO: "Band two",
  BOTH: "Both bands",
};

function isPersisted(id: string) {
  return !id.startsWith("new-") && !id.startsWith("fallback-");
}

export function MarqueePageClient({ user }: MarqueePageProps) {
  const [settings, setSettings] = useState<SettingsForm | null>(null);
  const [items, setItems] = useState<MarqueeItemData[]>([]);
  const [trashed, setTrashed] = useState<MarqueeItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingItems, setSavingItems] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadTrash = useCallback(async () => {
    const response = await fetch("/api/admin/marquee/items?trash=true");
    const data = await response.json();
    setTrashed(Array.isArray(data.items) ? data.items : []);
  }, []);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const [settingsRes, itemsRes, trashRes] = await Promise.all([
          fetch("/api/admin/marquee"),
          fetch("/api/admin/marquee/items"),
          fetch("/api/admin/marquee/items?trash=true"),
        ]);
        const settingsData = await settingsRes.json();
        const itemsData = await itemsRes.json();
        const trashData = await trashRes.json();
        if (!active) return;
        startTransition(() => {
          setSettings(settingsData.marquee);
          setItems(Array.isArray(itemsData.items) ? itemsData.items : []);
          setTrashed(Array.isArray(trashData.items) ? trashData.items : []);
          setLoading(false);
        });
      } catch {
        if (!active) return;
        toast.error("Failed to load Marquee Bands");
        startTransition(() => setLoading(false));
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const bandCounts = useMemo(
    () => ({
      one: items.filter((item) => item.band === "ONE" || item.band === "BOTH").length,
      two: items.filter((item) => item.band === "TWO" || item.band === "BOTH").length,
      visible: items.filter((item) => item.isVisible && item.isActive).length,
    }),
    [items],
  );

  function updateItem(index: number, patch: Partial<MarqueeItemData>) {
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
        id: `new-${Date.now()}`,
        kind: "TEXT",
        band: "BOTH",
        text: "#NewHighlight",
        imageUrl: null,
        imageAlt: "",
        imageWidth: 120,
        imageHeight: 40,
        href: null,
        outlined: current.length % 2 === 1,
        displayOrder: current.length,
        isVisible: true,
        isActive: true,
        deletedAt: null,
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((current) =>
      current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({ ...item, displayOrder: itemIndex })),
    );
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next.map((item, itemIndex) => ({ ...item, displayOrder: itemIndex }));
    });
  }

  async function runItemAction(
    id: string,
    action: "duplicate" | "soft-delete" | "restore" | "hard-delete",
  ) {
    if (!isPersisted(id)) {
      toast.error("Save the item before running this action");
      return;
    }
    setBusyId(id);
    try {
      const response = await fetch("/api/admin/marquee/items/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id], action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Action failed");

      const [itemsRes] = await Promise.all([
        fetch("/api/admin/marquee/items"),
        loadTrash(),
      ]);
      const itemsData = await itemsRes.json();
      setItems(Array.isArray(itemsData.items) ? itemsData.items : []);
      toast.success("Marquee items updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    try {
      const response = await fetch("/api/admin/marquee", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setSettings(data.marquee);
      toast.success("Marquee settings updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingSettings(false);
    }
  }

  async function saveItems(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingItems(true);
    try {
      const response = await fetch("/api/admin/marquee/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item, index) => ({
            id: isPersisted(item.id) ? item.id : undefined,
            kind: item.kind,
            band: item.band,
            text: item.text,
            imageUrl: item.imageUrl,
            imageAlt: item.imageAlt,
            imageWidth: item.imageWidth,
            imageHeight: item.imageHeight,
            href: item.href,
            outlined: item.outlined,
            displayOrder: index,
            isVisible: item.isVisible,
            isActive: item.isActive,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setItems(data.items);
      await loadTrash();
      toast.success("Marquee items updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSavingItems(false);
    }
  }

  return (
    <>
      <AdminHeader
        user={user}
        title="Marquee Bands"
        description="Manage the crossing ribbon strip — band styling, motion, and every text or logo item."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Band settings</CardTitle>
            <CardDescription>
              Colours, direction, speed, separators, and the geometry shared by both ribbons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !settings ? (
              <div className="h-48 animate-pulse rounded-xl bg-muted" />
            ) : (
              <form onSubmit={saveSettings} className="space-y-6">
                <Tabs defaultValue="general">
                  <TabsList className="flex h-auto flex-wrap">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="band-one">Band one</TabsTrigger>
                    <TabsTrigger value="band-two">Band two</TabsTrigger>
                    <TabsTrigger value="layout">Layout</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                      <Switch
                        checked={settings.isVisible}
                        onCheckedChange={(isVisible) =>
                          setSettings({ ...settings, isVisible })
                        }
                      />
                      <div>
                        <Label>Section visible</Label>
                        <p className="text-xs text-muted-foreground">
                          Hidden sections stay in the CMS but leave the public homepage.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Layout</Label>
                        <Select
                          value={settings.layout}
                          onValueChange={(layout) => {
                            if (layout === "stacked" || layout === "crossed") {
                              setSettings({ ...settings, layout });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stacked">
                              Stacked — parallel ribbons
                            </SelectItem>
                            <SelectItem value="crossed">
                              Crossed — ribbons form an X
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Crossed needs a larger skew to read; stacked stays clean at any angle.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Accessible section label</Label>
                        <Input
                          value={settings.ariaLabel}
                          onChange={(event) =>
                            setSettings({ ...settings, ariaLabel: event.target.value })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Announced by screen readers in place of the scrolling copy.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={settings.pauseOnHover}
                          onCheckedChange={(pauseOnHover) =>
                            setSettings({ ...settings, pauseOnHover })
                          }
                        />
                        <Label>Pause on hover</Label>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3">
                        <Switch
                          checked={settings.alternateOutline}
                          onCheckedChange={(alternateOutline) =>
                            setSettings({ ...settings, alternateOutline })
                          }
                        />
                        <div>
                          <Label>Auto-alternate outline</Label>
                          <p className="text-xs text-muted-foreground">
                            Overrides each item&apos;s own outline switch.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3 md:col-span-2">
                        <Switch
                          checked={settings.showSeparator}
                          onCheckedChange={(showSeparator) =>
                            setSettings({ ...settings, showSeparator })
                          }
                        />
                        <Label>Show separator shape between items</Label>
                      </div>
                    </div>
                  </TabsContent>

                  {[
                    {
                      value: "band-one",
                      count: bandCounts.one,
                      show: settings.showBandOne,
                      bgColor: settings.bandOneBgColor,
                      textColor: settings.bandOneTextColor,
                      direction: settings.bandOneDirection,
                      speed: settings.bandOneSpeedSeconds,
                      separator: settings.bandOneSeparatorUrl,
                      patch: (patch: Partial<SettingsForm>) =>
                        setSettings({ ...settings, ...patch }),
                      keys: {
                        show: "showBandOne",
                        bgColor: "bandOneBgColor",
                        textColor: "bandOneTextColor",
                        direction: "bandOneDirection",
                        speed: "bandOneSpeedSeconds",
                        separator: "bandOneSeparatorUrl",
                      },
                    },
                    {
                      value: "band-two",
                      count: bandCounts.two,
                      show: settings.showBandTwo,
                      bgColor: settings.bandTwoBgColor,
                      textColor: settings.bandTwoTextColor,
                      direction: settings.bandTwoDirection,
                      speed: settings.bandTwoSpeedSeconds,
                      separator: settings.bandTwoSeparatorUrl,
                      patch: (patch: Partial<SettingsForm>) =>
                        setSettings({ ...settings, ...patch }),
                      keys: {
                        show: "showBandTwo",
                        bgColor: "bandTwoBgColor",
                        textColor: "bandTwoTextColor",
                        direction: "bandTwoDirection",
                        speed: "bandTwoSpeedSeconds",
                        separator: "bandTwoSeparatorUrl",
                      },
                    },
                  ].map((band) => (
                    <TabsContent key={band.value} value={band.value} className="mt-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={band.show}
                            onCheckedChange={(checked) =>
                              band.patch({ [band.keys.show]: checked })
                            }
                          />
                          <Label>Band visible</Label>
                        </div>
                        <Badge variant="secondary">{band.count} items assigned</Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <ColorField
                          label="Background colour"
                          value={band.bgColor}
                          onChange={(value) => band.patch({ [band.keys.bgColor]: value })}
                        />
                        <ColorField
                          label="Text colour"
                          value={band.textColor}
                          onChange={(value) => band.patch({ [band.keys.textColor]: value })}
                          description="Also used for the outlined text stroke."
                        />
                        <div className="space-y-2">
                          <Label>Scroll direction</Label>
                          <Select
                            value={band.direction}
                            onValueChange={(value) => {
                              if (value === "left" || value === "right") {
                                band.patch({ [band.keys.direction]: value });
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Right to left</SelectItem>
                              <SelectItem value="right">Left to right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Loop duration (seconds)</Label>
                          <Input
                            type="number"
                            min={5}
                            max={180}
                            value={band.speed}
                            onChange={(event) =>
                              band.patch({ [band.keys.speed]: Number(event.target.value) })
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Higher is slower. 34s matches the reference design.
                          </p>
                        </div>
                      </div>
                      <ImageField
                        label="Separator shape"
                        value={band.separator}
                        onChange={(value) => band.patch({ [band.keys.separator]: value })}
                      />
                    </TabsContent>
                  ))}

                  <TabsContent value="layout" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Skew angle (deg)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={20}
                          step={0.1}
                          value={settings.skewDegrees}
                          onChange={(event) =>
                            setSettings({
                              ...settings,
                              skewDegrees: Number(event.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Font size (px)</Label>
                        <Input
                          type="number"
                          min={12}
                          max={96}
                          value={settings.fontSizePx}
                          onChange={(event) =>
                            setSettings({
                              ...settings,
                              fontSizePx: Number(event.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Item gap (px)</Label>
                        <Input
                          type="number"
                          min={4}
                          max={120}
                          value={settings.itemGapPx}
                          onChange={(event) =>
                            setSettings({
                              ...settings,
                              itemGapPx: Number(event.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Band padding (px)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={120}
                          value={settings.bandPaddingPx}
                          onChange={(event) =>
                            setSettings({
                              ...settings,
                              bandPaddingPx: Number(event.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="overflow-hidden rounded-xl border border-border/70">
                        {(
                          [
                            {
                              key: "one" as const,
                              bg: settings.bandOneBgColor,
                              color: settings.bandOneTextColor,
                              skew: -settings.skewDegrees,
                            },
                            {
                              key: "two" as const,
                              bg: settings.bandTwoBgColor,
                              color: settings.bandTwoTextColor,
                              skew:
                                settings.layout === "crossed"
                                  ? settings.skewDegrees
                                  : -settings.skewDegrees,
                            },
                          ] as const
                        ).map((band) => (
                          <div
                            key={band.key}
                            className="flex items-center gap-4 overflow-hidden px-6 py-3 whitespace-nowrap"
                            style={{
                              backgroundColor: band.bg,
                              color: band.color,
                              transform: `skewY(${band.skew}deg)`,
                            }}
                          >
                            {items.slice(0, 4).map((item, index) => (
                              <span
                                key={item.id}
                                className="font-heading font-bold uppercase"
                                style={{
                                  fontSize: `${Math.min(settings.fontSizePx, 22)}px`,
                                  marginInlineEnd: `${settings.itemGapPx}px`,
                                  ...((settings.alternateOutline
                                    ? index % 2 === 1
                                    : item.outlined)
                                    ? {
                                        color: "transparent",
                                        WebkitTextStroke: `1px ${band.color}`,
                                      }
                                    : {}),
                                }}
                              >
                                {item.text || item.imageAlt || "Item"}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Static approximation — the live section scrolls and full-bleeds each band.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end">
                  <SaveButton loading={savingSettings} />
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Marquee items</CardTitle>
              <CardDescription>
                Text, logo, or logo + text entries. Assign each to band one, band two, or both.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {bandCounts.visible} live / {items.length} total
              </Badge>
              <Button type="button" variant="outline" onClick={addItem} disabled={loading}>
                <Plus className="size-4" />
                Add item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="trash">Trash ({trashed.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4">
                <form onSubmit={saveItems} className="space-y-4">
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-36 animate-pulse rounded-xl bg-muted" />
                      ))}
                    </div>
                  ) : (
                    items.map((item, index) => (
                      <div
                        key={item.id}
                        className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <GripVertical className="size-4" />
                            <span className="text-xs font-medium">#{index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Move up"
                              disabled={index === 0}
                              onClick={() => moveItem(index, -1)}
                            >
                              <ArrowUp className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Move down"
                              disabled={index === items.length - 1}
                              onClick={() => moveItem(index, 1)}
                            >
                              <ArrowDown className="size-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={item.isVisible}
                                onCheckedChange={(isVisible) =>
                                  updateItem(index, { isVisible })
                                }
                              />
                              <Label>Visible</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={item.isActive}
                                onCheckedChange={(isActive) => updateItem(index, { isActive })}
                              />
                              <Label>Active</Label>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Duplicate item"
                              disabled={busyId === item.id || !isPersisted(item.id)}
                              onClick={() => runItemAction(item.id, "duplicate")}
                            >
                              <Copy className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Move to trash"
                              onClick={() =>
                                isPersisted(item.id)
                                  ? runItemAction(item.id, "soft-delete")
                                  : removeItem(index)
                              }
                              disabled={busyId === item.id}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <div className="space-y-2">
                            <Label>Item type</Label>
                            <Select
                              value={item.kind}
                              onValueChange={(kind) => {
                                if (kind) updateItem(index, { kind: kind as MarqueeItemKind });
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(KIND_LABELS).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Shown in</Label>
                            <Select
                              value={item.band}
                              onValueChange={(band) => {
                                if (band) updateItem(index, { band: band as MarqueeBandTarget });
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(BAND_LABELS).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Link (optional)</Label>
                            <Input
                              value={item.href ?? ""}
                              placeholder="/services"
                              onChange={(event) =>
                                updateItem(index, { href: event.target.value || null })
                              }
                            />
                          </div>
                          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background px-4 py-2">
                            <Switch
                              checked={item.outlined}
                              disabled={settings?.alternateOutline}
                              onCheckedChange={(outlined) => updateItem(index, { outlined })}
                            />
                            <Label>Outlined text</Label>
                          </div>
                        </div>

                        {item.kind !== "IMAGE" ? (
                          <div className="space-y-2">
                            <Label>Text</Label>
                            <Input
                              value={item.text}
                              placeholder="#Compliance"
                              onChange={(event) =>
                                updateItem(index, { text: event.target.value })
                              }
                            />
                          </div>
                        ) : null}

                        {item.kind !== "TEXT" ? (
                          <div className="space-y-4">
                            <Separator />
                            <ImageField
                              label="Image / logo"
                              value={item.imageUrl ?? ""}
                              onChange={(imageUrl) =>
                                updateItem(index, { imageUrl: imageUrl || null })
                              }
                            />
                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="space-y-2">
                                <Label>Image alt text</Label>
                                <Input
                                  value={item.imageAlt}
                                  onChange={(event) =>
                                    updateItem(index, { imageAlt: event.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Intrinsic width (px)</Label>
                                <Input
                                  type="number"
                                  min={8}
                                  max={1200}
                                  value={item.imageWidth}
                                  onChange={(event) =>
                                    updateItem(index, {
                                      imageWidth: Number(event.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Intrinsic height (px)</Label>
                                <Input
                                  type="number"
                                  min={8}
                                  max={400}
                                  value={item.imageHeight}
                                  onChange={(event) =>
                                    updateItem(index, {
                                      imageHeight: Number(event.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}

                  {!loading && !items.length ? (
                    <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                      No marquee items yet. Add your first hashtag or partner logo.
                    </div>
                  ) : null}

                  <div className="flex justify-end">
                    <SaveButton loading={savingItems} label="Save items" />
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="trash" className="mt-4 space-y-3">
                {trashed.length ? (
                  trashed.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {item.text || item.imageAlt || "Untitled item"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {KIND_LABELS[item.kind]} · {BAND_LABELS[item.band]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busyId === item.id}
                          onClick={() => runItemAction(item.id, "restore")}
                        >
                          <RotateCcw className="size-4" />
                          Restore
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={busyId === item.id}
                          onClick={() => runItemAction(item.id, "hard-delete")}
                        >
                          <XCircle className="size-4 text-destructive" />
                          Delete forever
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                    Trash is empty.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
