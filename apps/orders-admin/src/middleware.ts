import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Guards every /admin route at the edge. An unauthenticated request to an
 * admin page is redirected to the login screen; the API routes do their own
 * per-route role checks server-side (a middleware pass is necessary but not
 * sufficient — a staff user is authenticated but still can't cancel an order).
 *
 * This is deliberately a coarse gate: it only proves a valid session exists.
 * The finer-grained "which role may do what" lives in the route handlers, so
 * that hiding a button in the UI is never the only thing standing between a
 * staff user and an owner-only action.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
