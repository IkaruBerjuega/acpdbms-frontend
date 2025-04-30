import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LARAVEL_AUTH_CHECK_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/check`;

export async function middleware(req: NextRequest) {
  const storedToken = req.cookies.get("token")?.value || "";
  const storedRole = req.cookies.get("role")?.value || "";

  const decodedToken = decodeURIComponent(storedToken);
  const decodedRole = decodeURIComponent(storedRole);

  const isLoginPage = req.nextUrl.pathname === "/login";
  const url = new URL(req.url);

  let token = "";
  let role = "";

  // If no token or role, proceed to login page or redirect if necessary
  if (!storedToken && !storedRole) {
    return isLoginPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const parsedData = JSON.parse(decodedToken) as { token: string };
    token = parsedData.token;
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const parsedData = JSON.parse(decodedRole) as {
      role: "admin" | "employee" | "client";
    };
    role = parsedData.role;
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token) {
    return isLoginPage ? NextResponse.next() : addIsLoggedOutParam(req);
  }

  try {
    const laravelResponse = await fetch(LARAVEL_AUTH_CHECK_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!laravelResponse.ok) {
      return addIsLoggedOutParam(req);
    }

    // Laravel responded OK
    // - Remove "isLoggedOut" from the URL if it exists
    if (url.searchParams.has("isLoggedOut")) {
      url.searchParams.delete("isLoggedOut");
      return NextResponse.redirect(url);
    }

    // Already at the login page and authenticated → redirect based on role
    if (isLoginPage) {
      const redirectUrl = new URL(getRoleRedirect(role), req.url);
      redirectUrl.searchParams.delete("isLoggedOut");
      return NextResponse.redirect(redirectUrl);
    }

    // Role-based protection
    if (!req.nextUrl.pathname.startsWith(getRolePath(role))) {
      return NextResponse.redirect(new URL(getRoleRedirect(role), req.url));
    }
  } catch {
    return addIsLoggedOutParam(req);
  }

  return NextResponse.next();
}

function addIsLoggedOutParam(req: NextRequest) {
  const url = new URL(req.url);

  // Only add the isLoggedOut param if it's not already present
  if (!url.searchParams.has("isLoggedOut")) {
    url.searchParams.set("isLoggedOut", "true");
    return NextResponse.redirect(url); // one-time redirect to add the param
  }

  // If it's already there, don't redirect again — just proceed
  return NextResponse.next();
}

const getRoleRedirect = (role: string) => {
  return (
    {
      admin: "/admin/dashboard",
      employee: "/employee/tasks?view=assigned",
      client: "/client/approval?view=to review",
    }[role] || "/login"
  );
};

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
  matcher: ["/admin/:path*", "/employee/:path*", "/client/:path*"],
};
