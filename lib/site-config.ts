export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.carviassociates.com")
).replace(/\/$/, "");

export const SITE_NAME = "Carvi Associates";

export const SITE_DESCRIPTION =
  "Carvi Associates — Chartered Accountants offering audit, tax, GST, compliance and advisory services for Indian businesses.";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
