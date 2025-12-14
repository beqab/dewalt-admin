import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Allow access to login page and API routes (including NextAuth routes)
  if (pathname === "/login" || pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // If not authenticated, redirect to login
  if (!session?.user) {
    console.log(!session?.user, "redirecting to login");
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to all routes if authenticated
  return NextResponse.next();
});

// Configure which paths the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - Next.js internals (_next/static, _next/image, etc.)
     * - Static files (favicon, images, etc.)
     * - Root path (handled by page.tsx redirect)
     */
    "/((?!_next/static|_next/image|favicon.ico|^/$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
