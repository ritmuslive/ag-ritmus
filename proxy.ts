import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/welcome", "/settings"];
// Routes that require admin role
const adminRoutes = ["/admin"];
// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/auth/sign-in"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Skip proxy for static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = !!session?.user;
  const hasUsername = !!session?.user?.username;
  const isAdmin = session?.user?.role === "admin";

  // Check if accessing protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Admin routes - require admin role
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (!isAdmin) {
      // Not admin, redirect to dashboard with error
      return NextResponse.redirect(
        new URL("/dashboard?error=unauthorized", request.url),
      );
    }
  }

  // Not authenticated trying to access protected route -> redirect to sign-in
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Authenticated user trying to access auth routes -> redirect based on profile
  if (isAuthRoute && isAuthenticated) {
    if (hasUsername) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/welcome", request.url));
    }
  }

  // Authenticated user accessing /welcome but already has username -> redirect to dashboard
  if (pathname === "/welcome" && isAuthenticated && hasUsername) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Authenticated user accessing /dashboard but no username -> redirect to welcome
  if (pathname.startsWith("/dashboard") && isAuthenticated && !hasUsername) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
