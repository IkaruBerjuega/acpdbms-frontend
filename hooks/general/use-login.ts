"use client";

import { LoginSchemaType } from "@/lib/form-constants/form-constants";
import { useApiMutation } from "../tanstack-query";
import { Verify2FARequest } from "@/lib/definitions";
import { Email2FARequest } from "@/lib/user-definitions";

// Custom hook for login
export function useLogin() {
  const login = useApiMutation<LoginSchemaType>({
    url: "/login",
    method: "POST",
    contentType: "application/json",
    auth: false,
  });

  const verify2fa = useApiMutation<Verify2FARequest>({
    url: "/verify-2fa",
    method: "POST",
    contentType: "application/json",
    auth: false,
  });

  const resend2fa = useApiMutation<Email2FARequest>({
    url: "/resend-2fa-code",
    method: "POST",
    contentType: "application/json",
    auth: false,
  });

  return { login, verify2fa, resend2fa };
}

// Custom hook for login
export function useLogout() {
  return useApiMutation<null>({
    url: "/logout",
    method: "POST",
    contentType: "application/json",
    auth: true,
  });
}
