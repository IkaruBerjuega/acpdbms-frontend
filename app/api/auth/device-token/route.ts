import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data: { device_token: string; email: string } = await req.json();

  console.log(data);

  if (!data) {
    return NextResponse.json(
      { error: "Device Token and Email are required" },
      { status: 400 }
    );
  }

  const existingCookie = req.cookies.get("device_code")?.value || "{}";
  const decodedCookie = decodeURIComponent(existingCookie);

  console.log("decoded cookie", decodedCookie);
  let cookieData: Record<string, string> = {};

  try {
    cookieData = JSON.parse(decodedCookie);
  } catch (err) {
    console.error("Failed to parse existing cookie:", err);
    cookieData = {};
  }

  cookieData[data.email] = data.device_token;

  const response = NextResponse.json({
    message: "Device token cookie set successfully",
  });

  response.cookies.set("device_code", JSON.stringify(cookieData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email query is required" },
      { status: 400 }
    );
  }

  const data = req.cookies.get("device_code")?.value;

  if (!data) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tokenData = JSON.parse(data);

    console.log(tokenData);

    if (!tokenData[email]) {
      return NextResponse.json(
        { error: "Device token not found for this email" },
        { status: 404 }
      );
    }

    return NextResponse.json({ device_token: tokenData[email] });
  } catch {
    return NextResponse.json(
      { error: "Invalid device token format" },
      { status: 403 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { device_token, email }: { device_token: string; email: string } =
    await req.json();

  if (!device_token || !email) {
    return NextResponse.json(
      { error: "Device Token and Email are required" },
      { status: 400 }
    );
  }

  const existingCookie = req.cookies.get("device_code")?.value;
  let updatedCookieData: Record<string, string> = {};

  try {
    if (existingCookie) {
      updatedCookieData = JSON.parse(existingCookie);
    }
  } catch {
    // If parsing fails, start fresh
    updatedCookieData = {};
  }

  updatedCookieData[email] = device_token;

  const response = NextResponse.json({
    message: "Device token updated successfully",
  });

  response.cookies.set("device_code", JSON.stringify(updatedCookieData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({
    message: "Device token deleted successfully",
  });

  response.cookies.set("device_code", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
