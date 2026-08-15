import { BLOG_CONTENT_TYPE_META, type BlogContentType } from "@/lib/cms/types";

export function formatCardDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${date.getDate()}, ${date.toLocaleString("en-IN", {
    month: "long",
    timeZone: "Asia/Kolkata",
  })}, ${date.getFullYear()}`;
}

export function formatLongDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export function toIsoDate(value: string | null): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function contentTypeLabel(type: BlogContentType): string {
  return BLOG_CONTENT_TYPE_META[type]?.label ?? "Blog";
}
