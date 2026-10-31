import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/constants";
import { safeNext } from "@/lib/safe-next";

/**
 * Next.js 16 renamed middleware.ts to proxy.ts. Same job: optimistic cookie check.
 * The API remains the source of truth on 401.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession =
    request.cookies.has(ACCESS_COOKIE) || request.cookies.has(REFRESH_COOKIE);

  if (pathname === "/login") {
    const sessionExpired = request.nextUrl.searchParams.get("session") === "expired";
    if (!hasSession || sessionExpired) return NextResponse.next();
    const destination = safeNext(request.nextUrl.searchParams.get("next")) ?? "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
