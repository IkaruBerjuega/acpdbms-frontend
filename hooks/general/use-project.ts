import { grantProjectAccessRequest } from "@/lib/form-constants/form-constants";
import { useApiMutation, useApiQuery } from "../tanstack-query";
import {
  ProjectListResponseInterface,
  TeamDetailsResponse,
} from "@/lib/definitions";

interface useProjectListProps<T> {
  isArchived?: boolean;
  initialData?: T[];
}

// Hook for fetching the project list
export const useProjectList = <T>({
  isArchived,
  initialData,
}: useProjectListProps<T>) => {
  return useApiQuery<T[]>({
    key: !isArchived ? "projects" : "projects-archived",
    url: !isArchived ? "/project-list" : "/projects/archived",
    initialData: initialData,
  });
};

// Hook for fetching team details
export const useTeamDetails = (projectId: string) => {
  return useApiQuery<TeamDetailsResponse>({
    key: `teamDetails-${projectId}`,
    url: `/projects/${projectId}/team-details`,
    enabled: !!projectId, // Prevent fetching if no projectId
  });
};

export const useProjectActions = <T>(projectId?: string) => {
  //employee add
  const addTeamToProjects = useApiMutation<T>({
    url: `/projects/${projectId}/add-team-members`,
    method: "POST",
    contentType: "application/json",
    auth: true,
  });

  const addProject = useApiMutation<FormData>({
    url: "/projects",
    method: "POST",
    contentType: "",
    auth: true,
  });

  const cancelProject = useApiMutation<T>({
    url: `/projects/cancel`,
    method: "POST",
    contentType: "application/json",
    auth: true,
  });

  const removeProject = useApiMutation<T>({
    url: `/projects`,
    method: "DELETE",
    contentType: "application/json",
    auth: true,
  });

  const archiveUnarchiveProject = useApiMutation<T>({
    url: `/projects/archive`,
    method: "POST",
    contentType: "application/json",
    auth: true,
  });

  const onholdProject = useApiMutation<T>({
    url: `/projects/on-hold`,
    method: "POST",
    contentType: "application/json",
    auth: true,
  });

  const continueProject = useApiMutation<T>({
    url: `/projects/continue`,
    method: "POST",
    contentType: "application/json",
    auth: true,
  });

  return {
    addTeamToProjects,
    cancelProject,
    removeProject,
    archiveUnarchiveProject,
    addProject,
    onholdProject,
    continueProject,
  };
};
