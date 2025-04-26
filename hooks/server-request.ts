import { cookies } from "next/headers";

interface ServerRequestAPI {
  url: string;
  auth: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined in environment variables"
  );
}

export default async function serverRequestAPI({
  url,
  auth,
}: ServerRequestAPI) {
  const tokenResponse = (await cookies()).get("token")?.value;

  if (!tokenResponse) {
    console.warn("No token found in cookies");
    return null;
  }

  let token;
  try {
    const tokenParsed = JSON.parse(tokenResponse);
    token = tokenParsed.token;
    if (!token) {
      console.warn("Token not found in parsed cookie data");
      return null;
    }
  } catch (error) {
    console.error("Failed to parse token from cookies:", error);
    return null;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);
    return null;
  }

  if (!res.ok) {
    console.error(`HTTP error ${res.status} for ${url}:`, await res.text());
    return null;
  }

  let responseData;
  try {
    responseData = await res.json();
  } catch (error) {
    console.error(`Failed to parse JSON response for ${url}:`, error);
    return null;
  }

  return responseData || [];
}
