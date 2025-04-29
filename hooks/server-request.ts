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

  let token;
  if (tokenResponse) {
    token = JSON.parse(tokenResponse).token;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(auth && !!token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (error) {
    // console.error(`Fetch failed for ${url}:`, error);
    return null;
  }

  if (!res.ok) {
    // console.log(`HTTP error ${res.status} for ${url}:`, await res.text());
    return null;
  }

  let responseData;
  try {
    responseData = await res.json();
  } catch (error) {
    // console.error(`Failed to parse JSON response for ${url}:`, error);
    return null;
  }

  return responseData || [];
}
