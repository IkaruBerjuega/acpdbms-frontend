import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LARAVEL_AUTH_CHECK_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/check`;

export async function middleware(req: NextRequest) {
  const protectedPaths = ["/admin", "/employee", "/client", "/login"];
  const { pathname } = req.nextUrl;
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isLoginPage = pathname === "/login";

  const storedToken = req.cookies.get("token")?.value || "";
  const storedRole = req.cookies.get("role")?.value || "";

  const decodedToken = decodeURIComponent(storedToken);
  const decodedRole = decodeURIComponent(storedRole);

  let token = "";
  let role = "";

  //  If not protected but has isLoggedOut, remove it
  if (!isProtectedPath && req.nextUrl.searchParams.has("isLoggedOut")) {
    const cleanUrl = req.nextUrl.clone();
    cleanUrl.searchParams.delete("isLoggedOut");
    return NextResponse.redirect(cleanUrl);
  }

  // If not a protected page, allow
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // If no token/role, allow access to login, otherwise just mark isLoggedOut
  if (!storedToken || !storedRole) {
    if (isLoginPage) {
      return NextResponse.next();
    }
    return addIsLoggedOutParam(req);
  }

  try {
    const parsedData = JSON.parse(decodedToken) as { token: string };
    token = parsedData.token;
  } catch {
    return addIsLoggedOutParam(req);
  }

  try {
    const parsedData = JSON.parse(decodedRole) as {
      role: "admin" | "employee" | "client";
    };
    role = parsedData.role;
  } catch {
    return addIsLoggedOutParam(req);
  }

  if (!token) {
    if (isLoginPage) {
      return NextResponse.next();
    }
    return addIsLoggedOutParam(req);
  }

  try {
    const laravelResponse = await fetch(LARAVEL_AUTH_CHECK_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const url = req.nextUrl.clone();

    if (!laravelResponse.ok) {
      //  Laravel auth failed: stay on page, add isLoggedOut
      return addIsLoggedOutParam(req);
    }

    //  Laravel auth success: clean isLoggedOut if exists
    if (url.searchParams.has("isLoggedOut")) {
      url.searchParams.delete("isLoggedOut");
      return NextResponse.redirect(url);
    }

    //  Already authenticated, handle login page
    if (isLoginPage) {
      return NextResponse.redirect(new URL(getRoleRedirect(role), req.url));
    }

    //  Ensure role matches path
    if (!pathname.startsWith(getRolePath(role))) {
      return NextResponse.redirect(new URL(getRoleRedirect(role), req.url));
    }
  } catch {
    return addIsLoggedOutParam(req);
  }

  return NextResponse.next();
}

function addIsLoggedOutParam(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (!url.searchParams.has("isLoggedOut")) {
    url.searchParams.set("isLoggedOut", "true");
    return NextResponse.redirect(url);
  }

  // Already has isLoggedOut, just continue
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
  matcher: ["/:path*"],
};
