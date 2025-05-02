import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined in environment variables"
  );
}

// 🔓 For public/static requests — eligible for caching
export async function publicRequestAPI<T>({
  url,
}: {
  url: string;
}): Promise<T | undefined> {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method: "GET",
      cache: "no-cache", // or: next: { revalidate: 60 }
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return undefined;

    return await res.json();
  } catch (error) {
    console.error(`Public fetch failed for ${url}:`, error);
    return undefined;
  }
}

// 🔒 For dynamic/authenticated requests — no caching
export async function authRequestAPI<T>({
  url,
}: {
  url: string;
}): Promise<T | undefined> {
  try {
    const tokenResponse = (await cookies()).get("token")?.value;
    const token = tokenResponse ? JSON.parse(tokenResponse).token : null;

    const res = await fetch(`${API_URL}${url}`, {
      method: "GET",
      cache: "force-cache", // or: next: { revalidate: 60 }
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) return undefined;

    return await res.json();
  } catch (error) {
    console.error(`Auth fetch failed for ${url}:`, error);
    return undefined;
  }
}
