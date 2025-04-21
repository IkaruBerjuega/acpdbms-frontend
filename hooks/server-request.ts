import { cookies } from "next/headers";

interface ServerRequestAPI {
  url: string;
  auth: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default async function serverRequestAPI({
  url,
  auth,
}: ServerRequestAPI) {
  const tokenResponse = (await cookies()).get("token")?.value;

  if (!tokenResponse) {
    if (auth) return null;
    return null;
  }

  const tokenParsed = JSON.parse(tokenResponse);
  const { token } = tokenParsed;

  const res = await fetch(`${API_URL}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let responseData;

  try {
    responseData = await res.json();
  } catch {}

  return responseData || [];
}
