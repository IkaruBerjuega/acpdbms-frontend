"use client";

import { LoginSchemaType } from "@/lib/form-constants/form-constants";
import { useApiMutation } from "../tanstack-query-hook";

//hook for login
export const useLogin = () => {
  return useApiMutation<LoginSchemaType>({
    url: "/login",
    method: "POST",
    contentType: "application/json",
    auth: false,
  });
};
