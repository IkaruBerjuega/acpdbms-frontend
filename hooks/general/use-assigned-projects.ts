"use client";

import { ProjectListResponseInterface } from "@/lib/definitions";
import { useApiQuery } from "../tanstack-query";

export const useAssociatedProjects = ({
  role,
}: {
  role: "employee" | "client";
}) => {
  const isEmployee = role === "employee";
  return useApiQuery<ProjectListResponseInterface[]>({
    key: ["associated-projects"],
    url: isEmployee ? `/employee/projects` : "/client/projects",
  });
};
