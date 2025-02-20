import { NextRequest, NextResponse } from "next/server";

export async function POST<T extends LoginResponseInterface>(req: NextRequest) {
  const { token, user }: T = await req.json();

  if (!token && !user) {
    return NextResponse.json(
      { error: "Token and User Data is required" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ message: "Token set successfully" });

  response.cookies.set(
    "user-info-with-token",
    JSON.stringify({ token, user }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }
  );

  return response;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("user-info-with-token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tokenData = JSON.parse(token); // Parse token (if stored as JSON)
    return NextResponse.json(tokenData); // Return user info (not raw token)
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}

export async function PUT<T extends LoginResponseInterface>(req: NextRequest) {
  const body: T = await req.json();

  if (!body.token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Token updated successfully" });

  response.cookies.set("user-info-with-token", JSON.stringify(body), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ message: "Token deleted successfully" });

  response.cookies.set("user-info-with-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}
