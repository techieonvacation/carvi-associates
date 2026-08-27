import { prisma } from "@/lib/prisma";
import { mapSeoRedirect, normalizePath } from "@/lib/seo/mappers";
import type { SeoRedirectItem } from "@/lib/seo/types";

const CACHE_TTL_MS = 60_000;

type RedirectTable = {
  enabled: boolean;
  items: SeoRedirectItem[];
};

type RedirectCache = {
  table: RedirectTable;
  expiresAt: number;
  loading: Promise<RedirectTable> | null;
};

const globalForRedirects = globalThis as unknown as {
  carviRedirectCache?: RedirectCache;
};

const cache: RedirectCache = (globalForRedirects.carviRedirectCache ??= {
  table: { enabled: true, items: [] },
  expiresAt: 0,
  loading: null,
});

async function loadRedirects(): Promise<RedirectTable> {
  const [settings, rows] = await Promise.all([
    prisma.seoSettings.findUnique({
      where: { id: "default" },
      select: { redirectsEnabled: true },
    }),
    prisma.seoRedirect.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return {
    enabled: settings?.redirectsEnabled ?? true,
    items: rows.map((row) => mapSeoRedirect(row as unknown as Record<string, unknown>)),
  };
}

export async function getRedirectTable(): Promise<RedirectTable> {
  const now = Date.now();
  if (now < cache.expiresAt) return cache.table;
  if (cache.loading) return cache.loading;

  cache.loading = loadRedirects()
    .then((table) => {
      cache.table = table;
      cache.expiresAt = Date.now() + CACHE_TTL_MS;
      return table;
    })
    .catch(() => cache.table)
    .finally(() => {
      cache.loading = null;
    });

  return cache.loading;
}

export function invalidateRedirectCache() {
  cache.expiresAt = 0;
  cache.table = { enabled: true, items: [] };
}

export type RedirectMatch = {
  destination: string;
  statusCode: number;
  id: string;
};

export function matchRedirect(
  redirects: SeoRedirectItem[],
  pathname: string,
  search: string,
): RedirectMatch | null {
  const target = normalizePath(pathname);

  for (const redirect of redirects) {
    const source = redirect.matchType === "REGEX" ? redirect.source : normalizePath(redirect.source);
    let destination: string | null = null;

    if (redirect.matchType === "EXACT") {
      if (source === target) destination = redirect.destination;
    } else if (redirect.matchType === "PREFIX") {
      if (target === source || target.startsWith(`${source}/`)) {
        const remainder = target.slice(source.length);
        destination = `${redirect.destination.replace(/\/$/, "")}${remainder}`;
      }
    } else {
      try {
        const pattern = new RegExp(source);
        const result = pattern.exec(target);
        if (result) {
          destination = redirect.destination.replace(/\$(\d)/g, (_, index: string) =>
            result[Number(index)] ?? "",
          );
        }
      } catch {
        destination = null;
      }
    }

    if (!destination) continue;

    const finalDestination =
      redirect.preserveQuery && search && !destination.includes("?")
        ? `${destination}${search}`
        : destination;

    return {
      destination: finalDestination,
      statusCode: redirect.statusCode,
      id: redirect.id,
    };
  }

  return null;
}

export function recordRedirectHit(id: string) {
  if (id.startsWith("fallback-")) return;
  void prisma.seoRedirect
    .update({
      where: { id },
      data: { hitCount: { increment: 1 }, lastHitAt: new Date() },
    })
    .catch(() => undefined);
}
