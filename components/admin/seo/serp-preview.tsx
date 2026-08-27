"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SerpPreviewProps = {
  url: string;
  title: string;
  description: string;
};

function meter(length: number, min: number, max: number) {
  if (length === 0) return { tone: "text-destructive", note: "Empty" };
  if (length < min) return { tone: "text-amber-600", note: "Too short" };
  if (length > max) return { tone: "text-amber-600", note: "Too long" };
  return { tone: "text-emerald-600", note: "Good" };
}

export function SerpPreview({ url, title, description }: SerpPreviewProps) {
  const titleMeter = meter(title.trim().length, 30, 65);
  const descriptionMeter = meter(description.trim().length, 70, 165);

  return (
    <div className="space-y-3">
      <Label>Search result preview</Label>
      <div className="rounded-xl border border-border/70 bg-white p-4 dark:bg-muted/20">
        <p className="truncate text-xs text-emerald-700 dark:text-emerald-400">{url}</p>
        <p className="mt-1 line-clamp-1 text-[18px] leading-snug text-[#1a0dab] dark:text-blue-400">
          {title || "Untitled page"}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {description || "No meta description set."}
        </p>
      </div>
      <div className="flex flex-wrap gap-4 text-xs">
        <span className={cn("font-medium", titleMeter.tone)}>
          Title {title.trim().length} chars · {titleMeter.note}
        </span>
        <span className={cn("font-medium", descriptionMeter.tone)}>
          Description {description.trim().length} chars · {descriptionMeter.note}
        </span>
      </div>
    </div>
  );
}
