import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token }: { token: string } = await req.json();

  if (!token) {
    return NextResponse.json(
      { error: "Token and User Data is required" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ message: "Token set successfully" });

  response.cookies.set("token", JSON.stringify({ token }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

export async function GET(req: NextRequest) {
  const data = req.cookies.get("token")?.value;

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
  const body: { token: string } = await req.json();

  if (!body.token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Token updated successfully" });

  response.cookies.set("token", JSON.stringify(body), {
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

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}
