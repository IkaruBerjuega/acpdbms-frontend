"use client";

import { Enabled, useMutation, useQuery } from "@tanstack/react-query";
import { useToken } from "./general/use-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// General function for API mutations
export const requestAPI = async ({
  url,
  method = "POST",
  body,
  contentType = "application/json",
  auth = true,
  additionalHeaders,
}: {
  url: string;
  method?: string;
  body?: any;
  contentType: string;
  auth: boolean;
  additionalHeaders?: Record<string, string>;
}) => {
  const { getToken } = useToken();

  let userData;

  if (auth) {
    userData = await getToken();
  }

  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {
    // Only add Content-Type header if the body is not FormData.
    ...(!isFormData && contentType ? { "Content-Type": contentType } : {}),
    ...(auth ? { Authorization: `Bearer ${userData?.token}` } : {}),
    ...(additionalHeaders || {}),
  };

  const res = await fetch(`${API_URL}${url}`, {
    method,
    credentials: "include",
    headers,
    // If body is FormData, send it as is. Otherwise, stringify it.
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  let responseData;
  try {
    responseData = await res.json();
  } catch (error) {
    throw new Error("Failed to parse server response");
  }

  if (!res.ok)
    throw new Error(responseData?.message || `Failed to ${method} data`);
  return responseData;
};

// Mutation Hook
export function useApiMutation<T>({
  url,
  method,
  contentType = "application/json",
  auth = true,
  additionalHeaders,
}: {
  url: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  contentType: string;
  auth: boolean;
  additionalHeaders?: Record<string, string>;
}) {
  const mutation = useMutation({
    mutationFn: (body?: T) =>
      requestAPI({
        url,
        method,
        body,
        contentType,
        auth,
        additionalHeaders,
      }),
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    data: mutation.data,
    error:
      (mutation.error as unknown as { email?: string })?.email ||
      mutation.error?.message,
  };
}

export function useApiQuery<T>({
  key,
  url,
  additionalHeaders,
  initialData,
  enabled,
  auth = true,
}: {
  key: string | string[];
  url: string;
  additionalHeaders?: Record<string, string>;
  initialData?: T;
  enabled?: Enabled<T, Error, T, string[]>;
  auth?: boolean;
}) {
  const { getToken } = useToken();

  const fetchApiData = async (): Promise<T> => {
    const userData = await getToken();

    const response = await fetch(`${API_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: `Bearer ${userData?.token}` } : {}),
        ...(additionalHeaders || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
  };

  const queryKey = typeof key === "string" ? [key] : key;

  const { data, isLoading, isPending, error, isError } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchApiData(),
    initialData: initialData,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
    isPending,
    error,
    isError,
  };
}
