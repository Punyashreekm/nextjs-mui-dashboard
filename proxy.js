import { NextResponse } from "next/server";

/**
 * Route protection proxy.
 *
 * Checks for the NextAuth session cookie on protected routes.
 * In development the cookie is "next-auth.session-token";
 * in production (HTTPS) it becomes "__Secure-next-auth.session-token".
 * If neither exists the user is redirected to /login.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/products");

  if (!isProtected) return NextResponse.next();

  const sessionToken =
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("__Secure-next-auth.session-token");

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/users",
    "/users/:path*",
    "/products",
    "/products/:path*",
  ],
};
