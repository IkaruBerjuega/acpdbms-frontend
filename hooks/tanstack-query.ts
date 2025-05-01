"use client";

import { Enabled, useMutation, useQuery } from "@tanstack/react-query";
import { useToken } from "./general/use-token";
import { useDeviceTokenStore } from "./states/create-store";
import { useMemo } from "react";

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

  let deviceToken;

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
  enableDeviceToken = true,
}: {
  url: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  contentType: string;
  auth: boolean;
  additionalHeaders?: Record<string, string>;
  enableDeviceToken?: boolean;
}) {
  const { data: device_token } = useDeviceTokenStore();

  const deviceToken = device_token[0];

  const headers = useMemo(() => {
    const headers: Record<string, string> = {
      ...additionalHeaders,
    };

    if (enableDeviceToken && !!deviceToken) {
      headers["X-Device-Token"] = deviceToken;
    }

    return headers;
  }, [additionalHeaders, enableDeviceToken, deviceToken]);

  const mutation = useMutation({
    mutationFn: (body?: T) =>
      requestAPI({
        url,
        method,
        body,
        contentType,
        auth,
        additionalHeaders: headers,
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
  enableDeviceToken = true,
}: {
  key: string | string[];
  url: string;
  additionalHeaders?: Record<string, string>;
  initialData?: T;
  enabled?: Enabled<T, Error, T, string[]>;
  auth?: boolean;
  enableDeviceToken?: boolean;
}) {
  const { getToken } = useToken();
  const { data: device_token } = useDeviceTokenStore();
  const deviceToken = device_token[0];

  const fetchApiData = async (): Promise<T> => {
    const userData = await getToken();
    const response = await fetch(`${API_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: `Bearer ${userData?.token}` } : {}),
        ...(additionalHeaders || {}),
        ...(!!deviceToken && enableDeviceToken
          ? { "X-Device-Token": deviceToken }
          : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Client Fetched Data:", data); // Debug
    return data;
  };

  const queryKey = typeof key === "string" ? [key] : key;

  const { data, isLoading, isPending, error, isError, isFetching } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchApiData(),
    initialData: initialData,
    enabled: enabled,
    staleTime: Infinity,
    retry: 2,
    refetchOnMount: false, // Prevent refetch on mount
    refetchOnWindowFocus: false, // Prevent refetch on focus
    refetchOnReconnect: false, // Prevent refetch on reconnect
  });

  // Debug
  console.log(
    "Query Data:",
    data,
    "Is Loading:",
    isLoading,
    "Is Fetching:",
    isFetching
  );

  return {
    data,
    isLoading,
    isPending,
    error,
    isError,
    isFetching,
  };
}
