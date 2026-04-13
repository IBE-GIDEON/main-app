import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnSignin = req.nextUrl.pathname.startsWith("/signin");

  if (isOnDashboard && !isLoggedIn) {
    // Not logged in, kick to signin
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  if (isOnSignin && isLoggedIn) {
    // Already logged in, skip signin page and go to dashboard
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/signin",
    "/onboarding",
  ],
};
