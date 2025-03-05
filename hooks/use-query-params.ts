"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useQueryParams<T extends Record<string, string | null>>() {
  const searchParams = useSearchParams();

  const query = useMemo(() => {
    const params: Partial<T> = {} as Partial<T>;
    searchParams.forEach((value, key) => {
      params[key as keyof T] = value as T[keyof T];
    });

    const paramsString = new URLSearchParams(searchParams);
    return { paramsKey: params, params: paramsString };
  }, [searchParams]); // Dependency on searchParams.toString() ensures updates

  return query;
}
