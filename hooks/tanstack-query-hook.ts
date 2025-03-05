'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useToken } from './api-calls/use-token';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// General function for API mutations
const apiMutation = async ({
  url,
  method = 'POST',
  body,
  contentType = 'application/json',
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

  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {
    // Only add Content-Type header if the body is not FormData.
    ...(!isFormData && contentType ? { 'Content-Type': contentType } : {}),
    ...(auth ? { Authorization: `Bearer ${userData?.token}` } : {}),
    ...(additionalHeaders || {}),
  };

  const res = await fetch(`${API_URL}${url}`, {
    method,
    headers,
    // If body is FormData, send it as is. Otherwise, stringify it.
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  let responseData;
  try {
    responseData = await res.json();
  } catch (error) {
    throw new Error('Failed to parse server response');
  }

  if (!res.ok)
    throw new Error(responseData?.message || `Failed to ${method} data`);
  return responseData;
};

// Mutation Hook
export function useApiMutation<T>({
  url,
  method,
  contentType = 'application/json',
  auth = true,
  additionalHeaders,
}: {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  contentType: string;
  auth: boolean;
  additionalHeaders?: any;
}) {
  const mutation = useMutation({
    mutationFn: (body?: T) =>
      apiMutation({
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
    error: mutation.error?.message,
  };
}

export function useApiQuery<T>({
  key,
  url,
  additionalHeaders,
}: {
  key: string;
  url: string;
  additionalHeaders?: Record<string, string>;
}) {
  const { getToken } = useToken();

  const fetchApiData = async (): Promise<T> => {
    const userData = await getToken();

    const response = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(userData?.token
          ? { Authorization: `Bearer ${userData?.token}` }
          : {}),
        ...(additionalHeaders || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
  };

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: [key],
    queryFn: () => fetchApiData(),
  });

  return {
    data,
    isLoading,
    isPending,
    error,
  };
}
