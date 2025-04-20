import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { role }: { role: "admin" | "employee" | "client" } = await req.json();

  if (!role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  const response = NextResponse.json({
    message: "Role cookie set successfully",
  });

  response.cookies.set("role", JSON.stringify({ role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

export async function GET(req: NextRequest) {
  const data = req.cookies.get("role")?.value;

  if (!data) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tokenData = JSON.parse(data); // Parse token (if stored as JSON)
    return NextResponse.json(tokenData); // Return user info (not raw token)
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}

export async function PUT(req: NextRequest) {
  const body: { role: string } = await req.json();

  if (!body.role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Role updated successfully" });

  response.cookies.set("role", JSON.stringify(body), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Token deleted successfully" });

  response.cookies.set("role", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}
