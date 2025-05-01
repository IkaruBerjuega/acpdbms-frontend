import { cookies } from "next/headers";

interface ServerRequestAPI {
  url: string;
  auth?: boolean;
  cache?: RequestCache; // e.g., "no-store", "force-cache"
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined in environment variables"
  );
}

export default async function serverRequestAPI<T = any>({
  url,
  auth = true,
  cache = "no-store", // default to dynamic fetch
}: ServerRequestAPI): Promise<T | null> {
  const cookieStore = cookies();
  const tokenCookie = (await cookieStore).get("token")?.value;
  const token = tokenCookie ? JSON.parse(tokenCookie).token : null;

  try {
    const res = await fetch(`${API_URL}${url}`, {
      method: "GET",
      cache,
      headers: {
        "Content-Type": "application/json",
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      // Optionally log error here
      return null;
    }

    const data = await res.json();
    return data ?? null;
  } catch (err) {
    // Optionally log fetch error here
    return null;
  }
}
