import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LARAVEL_AUTH_CHECK_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/check`;

export async function middleware(req: NextRequest) {
  const storedToken = req.cookies.get("token")?.value || "";
  const storedRole = req.cookies.get("role")?.value || "";

  // Decode URL-encoded cookie
  const decodedToken = decodeURIComponent(storedToken);
  const decodedRole = decodeURIComponent(storedRole);

  // Check if the user is on the login page
  const isLoginPage = req.nextUrl.pathname === "/login";

  let token = "";
  let role = "";

  // If no token, only allow access to the login page
  if (!storedToken && !storedRole) {
    return isLoginPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", req.url));
  }

  // Try parsing the stored token data
  try {
    const parsedData = JSON.parse(decodedToken) as { token: string };
    token = parsedData.token;
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Try parsing the stored token data
  try {
    const parsedData = JSON.parse(decodedRole) as {
      role: "admin" | "employee" | "client";
    };
    role = parsedData.role;
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token) {
    return isLoginPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // const laravelResponse = await fetch(LARAVEL_AUTH_CHECK_URL, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    // if (!laravelResponse.ok) {
    //   return NextResponse.redirect(new URL("/login", req.url));
    // }

    // Allow users to stay on the login page if they are NOT logged in
    if (isLoginPage) {
      return NextResponse.redirect(new URL(getRoleRedirect(role), req.url));
    }

    // Ensure users access only the correct role-based path
    if (!req.nextUrl.pathname.startsWith(getRolePath(role))) {
      return NextResponse.redirect(new URL(getRoleRedirect(role), req.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

//  Utility functions for cleaner role-based logic
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

// Apply middleware to protected routes and the login page
export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/client/:path*", "/login"],
};
