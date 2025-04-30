import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LARAVEL_AUTH_CHECK_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/check`;

export async function middleware(req: NextRequest) {
  const storedToken = req.cookies.get("token")?.value;
  const storedRole = req.cookies.get("role")?.value;
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isProtectedPath = req.nextUrl.pathname.match(
    /^\/(admin|employee|client)/
  );

  // If no token or role, redirect to login for protected paths
  if (!storedToken || !storedRole) {
    if (isProtectedPath) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  let token: string;
  let role: "admin" | "employee" | "client";

  // Parse token
  try {
    const parsedToken = JSON.parse(storedToken) as { token: string };
    token = parsedToken.token;
  } catch {
    return redirectToLogin(req, isProtectedPath);
  }

  // Parse role
  try {
    const parsedRole = JSON.parse(storedRole) as {
      role: "admin" | "employee" | "client";
    };
    role = parsedRole.role;
  } catch {
    return redirectToLogin(req, isProtectedPath);
  }

  // Handle login page: delete cookies and redirect if authenticated
  if (isLoginPage) {
    const response = NextResponse.redirect(
      new URL(getRoleRedirect(role), req.url)
    );
    response.cookies.delete("token");
    response.cookies.delete("role");
    return response;
  }

  // Verify token with Laravel
  try {
    const laravelResponse = await fetch(LARAVEL_AUTH_CHECK_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!laravelResponse.ok) {
      return redirectToLogin(req, isProtectedPath, role);
    }

    // Remove isLoggedOut param if present
    const url = new URL(req.url);
    if (url.searchParams.has("isLoggedOut")) {
      url.searchParams.delete("isLoggedOut");
      return NextResponse.redirect(url);
    }

    // Role-based path protection
    if (!req.nextUrl.pathname.startsWith(getRolePath(role))) {
      return NextResponse.redirect(new URL(getRoleRedirect(role), req.url));
    }
  } catch {
    return redirectToLogin(req, isProtectedPath, role);
  }

  return NextResponse.next();
}

// Utility function for redirects
function redirectToLogin(
  req: NextRequest,
  isProtectedPath: RegExpMatchArray | null,
  role?: string
) {
  const url = new URL(role ? getRoleRedirect(role) : "/login", req.url);

  // Add isLoggedOut param only for protected paths
  if (isProtectedPath) {
    url.searchParams.set("isLoggedOut", "true");
  }

  return NextResponse.redirect(url);
}

// Role-based redirect URLs
const getRoleRedirect = (role: string) => {
  return (
    {
      admin: "/admin/dashboard",
      employee: "/employee/tasks?view=assigned",
      client: "/client/approval?view=to review",
    }[role] || "/login"
  );
};

// Role-based path prefixes
const getRolePath = (role: string) => {
  return (
    {
      admin: "/admin",
      employee: "/employee",
      client: "/client",
    }[role] || "/login"
  );
};

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/client/:path*", "/login"],
};
