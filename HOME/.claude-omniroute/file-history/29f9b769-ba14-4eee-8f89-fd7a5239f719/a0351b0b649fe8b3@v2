import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    // Allow access to login page
    if (path === "/admin/login") {
      return NextResponse.next();
    }

    // Check user and admin role
    // Note: In Next.js middleware, cookies can be checked directly or via server action.
    // For robust security, each admin page/action also calls requireAdmin().
    const sessionToken = request.cookies.get("session_token")?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};