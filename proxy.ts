import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getRedirectTable, matchRedirect, recordRedirectHit } from "@/lib/seo/redirects";
import { PATHNAME_HEADER } from "@/lib/seo/constants";

function withPathname(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(PATHNAME_HEADER, request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

async function handleAdmin(request: NextRequest, pathname: string) {
  if (pathname.startsWith("/admin/login")) {
    const session = await getSessionFromRequest(request);
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return withPathname(request);
  }

  const session = await getSessionFromRequest(request);
  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin/users") && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return withPathname(request);
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return handleAdmin(request, pathname);
  }

  if (!pathname.startsWith("/api/")) {
    const table = await getRedirectTable();
    const match = table.enabled ? matchRedirect(table.items, pathname, search) : null;
    if (match) {
      recordRedirectHit(match.id);
      const destination = match.destination.startsWith("http")
        ? new URL(match.destination)
        : new URL(match.destination, request.url);
      return NextResponse.redirect(destination, match.statusCode);
    }
  }

  return withPathname(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|fonts|favicon.ico).*)"],
};
