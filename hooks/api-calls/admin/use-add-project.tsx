"use client";

import { useApiMutation } from "@/hooks/tanstack-query";
// The type here is FormData since we are sending file data
export function useAddProject() {
  return useApiMutation<FormData>({
    url: "/project-create",
    method: "POST",
    contentType: "multipart/form-data",
    auth: true, // Assumes authentication is required for creating a project
  });
}
