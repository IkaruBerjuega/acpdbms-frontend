"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useToken } from "./api-calls/use-token";

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
  const userData = auth ? await getToken() : null; // Fetch token before making request

  const res = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": contentType,
      ...(auth ? { Authorization: `Bearer ${userData?.token}` } : {}),
      ...(additionalHeaders && additionalHeaders),
    },
    body: body ? JSON.stringify(body) : body,
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
  additionalHeaders?: any;
}) {
  const mutation = useMutation({
    mutationFn: (body?: T) =>
      requestAPI({
        url,
        method,
        body,
        contentType,
        auth,
        ...(additionalHeaders && additionalHeaders),
      }),

    //You should be passing the onSuccess and onError directly on where wil you use it
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    data: mutation.data,
    error: mutation.error?.message,
  };
}

export function useApiQuery<T>({
  key,
  url,
  additionalHeaders,
  initialData,
}: {
  key: string;
  url: string;
  additionalHeaders?: Record<string, string>;
  initialData?: T;
}) {
  const { getToken } = useToken(); // Call useToken() at the top level

  const fetchApiData = async (): Promise<T> => {
    const userData = await getToken(); // Fetch token before making request

    const response = await fetch(`${API_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(userData?.token
          ? { Authorization: `Bearer ${userData?.token}` }
          : {}),
        ...(additionalHeaders && additionalHeaders),
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
  };

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: [key],
    queryFn: () => fetchApiData(), // Pass function reference, NOT a function call
    initialData: initialData,
  });

  return {
    data,
    isLoading,
    isPending,
    error,
  };
}
