import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LARAVEL_AUTH_CHECK_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/check`;

export async function middleware(req: NextRequest) {
  const storedToken = req.cookies.get("token")?.value || "";
  const storedRole = req.cookies.get("role")?.value || "";

  const decodedToken = decodeURIComponent(storedToken);
  const decodedRole = decodeURIComponent(storedRole);

  const isLoginPage = req.nextUrl.pathname === "/login";

  let token = "";
  let role = "";

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
    return isLoginPage ? NextResponse.next() : addIsLoggedOutParam(req, role);
  }

  try {
    const laravelResponse = await fetch(LARAVEL_AUTH_CHECK_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const url = new URL(req.url);

    if (!laravelResponse.ok) {
      return addIsLoggedOutParam(req, role);
    }

    // Laravel responded OK
    // - Remove "isLoggedOut" from the URL if it exists
    if (url.searchParams.has("isLoggedOut")) {
      url.searchParams.delete("isLoggedOut");
      return NextResponse.redirect(url);
    }

    // Already at the login page and authenticated → redirect based on role
    if (isLoginPage) {
      const url = new URL(getRoleRedirect(role), req.url);
      url.searchParams.delete("isLoggedOut");
      return NextResponse.redirect(url);
    }

    //  Role-based protection
    if (!req.nextUrl.pathname.startsWith(getRolePath(role))) {
      return NextResponse.redirect(new URL(getRoleRedirect(role), req.url));
    }
  } catch {
    return addIsLoggedOutParam(req, role);
  }

  return NextResponse.next();
}

// Utility redirect function when invalid
function addIsLoggedOutParam(req: NextRequest, role: string) {
  const url = new URL(getRoleRedirect(role), req.url);
  url.searchParams.set("isLoggedOut", "true");

  const response = NextResponse.redirect(url);

  return response;
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
  matcher: ["/admin/:path*", "/employee/:path*", "/client/:path*", "/login"],
};
