import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  // Allow access to login page and API routes (including NextAuth routes)
  if (pathname === "/login" || pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // If not authenticated, redirect to login
  if (!session) {
    console.log(!session, "redirecting to login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to all routes if authenticated
  return NextResponse.next();
}

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
