"use client";

import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AuditCheck, AuditReport, AuditSeverity } from "@/lib/seo/audit";
import { cn } from "@/lib/utils";

type AdminUser = { name: string; email: string; role: "ADMIN" | "MANAGER" };

const SEVERITY_META: Record<
  AuditSeverity,
  { icon: typeof CheckCircle2; tone: string; label: string }
> = {
  critical: { icon: XCircle, tone: "text-destructive", label: "Critical" },
  warning: { icon: AlertTriangle, tone: "text-amber-600", label: "Needs work" },
  info: { icon: Info, tone: "text-sky-600", label: "Opportunity" },
  pass: { icon: CheckCircle2, tone: "text-emerald-600", label: "Passing" },
};

const SEVERITY_ORDER: AuditSeverity[] = ["critical", "warning", "info", "pass"];

export function SeoAuditPageClient({ user }: { user: AdminUser }) {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/seo/audit");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Audit failed");
      startTransition(() => {
        setReport(data.audit);
        setLoading(false);
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Audit failed");
      startTransition(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const grouped = useMemo(() => {
    if (!report) return new Map<string, AuditCheck[]>();
    const map = new Map<string, AuditCheck[]>();
    const sorted = [...report.checks].sort(
      (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity),
    );
    for (const check of sorted) {
      const list = map.get(check.group) ?? [];
      list.push(check);
      map.set(check.group, list);
    }
    return map;
  }, [report]);

  return (
    <>
      <AdminHeader
        user={user}
        title="SEO health"
        description="Live audit of indexing, on-page, structured data, off-page and AEO readiness."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border/70">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Readiness score</CardTitle>
              <CardDescription>
                Recomputed from the live CMS every time this page loads.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                void load();
              }}
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              Re-run audit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading || !report ? (
              <div className="h-32 animate-pulse rounded-xl bg-muted" />
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="min-w-40">
                    <p className="text-5xl font-bold tracking-tight">{report.score}</p>
                    <p className="text-sm text-muted-foreground">out of 100</p>
                  </div>
                  <div className="min-w-60 flex-1">
                    <Progress value={report.score} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SEVERITY_ORDER.map((severity) => (
                      <Badge
                        key={severity}
                        variant={severity === "critical" ? "destructive" : "outline"}
                      >
                        {SEVERITY_META[severity].label}: {report.counts[severity]}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {[...grouped.entries()].map(([group, checks]) => (
                    <div key={group} className="space-y-2">
                      <p className="text-sm font-semibold tracking-tight">{group}</p>
                      <div className="space-y-2">
                        {checks.map((check) => {
                          const meta = SEVERITY_META[check.severity];
                          const Icon = meta.icon;
                          return (
                            <div
                              key={check.id}
                              className="flex flex-wrap items-start gap-3 rounded-xl border border-border/70 px-4 py-3"
                            >
                              <Icon className={cn("mt-0.5 size-4 shrink-0", meta.tone)} />
                              <div className="min-w-60 flex-1">
                                <p className="text-sm font-medium">{check.label}</p>
                                <p className="text-xs text-muted-foreground">{check.detail}</p>
                              </div>
                              {check.fixHref && check.severity !== "pass" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  render={<Link href={check.fixHref} />}
                                >
                                  Fix
                                </Button>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
