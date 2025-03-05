import { cookies } from "next/headers";
import { useToken } from "./api-calls/use-token";

interface ServerRequestAPI {
  url: string;
  auth: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default async function serverRequestAPI({
  url,
  auth,
}: ServerRequestAPI) {
  const userDataCookie = (await cookies()).get("user-info-with-token")?.value;

  if (!userDataCookie) {
    if (auth) return null;
    return null;
  }

  const userData = JSON.parse(userDataCookie);
  const { token } = userData;

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

  return responseData;
}
