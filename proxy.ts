import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_SIGNED_IN_REDIRECT = "/dashboard";
const PUBLIC_ROUTES = new Set([
  "/",
  "/auth-error",
  "/help",
  "/pandt",
  "/pricing",
  "/signin",
  "/use-case",
]);
const PUBLIC_ROUTE_PREFIXES = ["/blog"];
const PUBLIC_API_PREFIXES = ["/api/auth"];

function isPublicRoute(pathname: string) {
  if (PUBLIC_ROUTES.has(pathname)) {
    return true;
  }

  return PUBLIC_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isPublicApiRoute(pathname: string) {
  return PUBLIC_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function buildSignupRedirectUrl(req: NextRequest) {
  const signInUrl = new URL("/signin", req.nextUrl.origin);

  signInUrl.searchParams.set("mode", "signup");

  const callbackUrl = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  if (callbackUrl && callbackUrl !== "/") {
    signInUrl.searchParams.set("callbackUrl", callbackUrl);
  }

  return signInUrl;
}

function isDocumentRequest(req: NextRequest) {
  const accept = req.headers.get("accept") ?? "";
  const fetchDestination = req.headers.get("sec-fetch-dest");

  return fetchDestination === "document" || accept.includes("text/html");
}

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const { pathname } = req.nextUrl;
  const isOnSignin = pathname === "/signin" || pathname.startsWith("/signin/");
  const isApiRoute = pathname.startsWith("/api/");
  const isPublicPage = isPublicRoute(pathname);
  const isPublicApi = isPublicApiRoute(pathname);

  if (isOnSignin) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_SIGNED_IN_REDIRECT, req.url));
    }

    return NextResponse.next();
  }

  if (isPublicPage || isPublicApi) {
    return NextResponse.next();
  }

  if (isLoggedIn) {
    return NextResponse.next();
  }

  const signupUrl = buildSignupRedirectUrl(req);

  if (isApiRoute && !isDocumentRequest(req)) {
    return NextResponse.json(
      {
        error: "Authentication required.",
        redirectTo: `${signupUrl.pathname}${signupUrl.search}`,
      },
      { status: 401 },
    );
  }

  return NextResponse.redirect(signupUrl);
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/webpack-hmr|.*\\..*).*)"],
};
