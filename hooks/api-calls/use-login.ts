"use client";

import { LoginSchemaType } from "@/lib/form-constants/form-constants";
import { useApiMutation } from "../tanstack-query";

// Custom hook for login
export function useLogin() {
  return useApiMutation<LoginSchemaType>({
    url: "/login",
    method: "POST",
    contentType: "application/json",
    auth: false,
  });
}
