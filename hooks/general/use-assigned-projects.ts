"use client";

import { ProjectListResponseInterface } from "@/lib/definitions";
import { useApiQuery } from "../tanstack-query";

export const useAssociatedProjects = () => {
  return useApiQuery<ProjectListResponseInterface[]>({
    key: ["associated-projects"],
    url: `/employee/projects`,
  });
};
