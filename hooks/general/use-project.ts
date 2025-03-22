import { useApiMutation, useApiQuery } from "../tanstack-query";
import {
  Phase,
  PhaseRequest,
  TeamDetailsResponse,
  TeamMemberDashboardResponse,
  ViceManagerPermissionResponse,
} from "@/lib/definitions";
import {
  ProjectFormSchemaType,
  ProjectUpdateRequest,
} from "@/lib/form-constants/project-constants";

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

// Hook for fetching project details
export const useViewProject = (id: string) => {
  const projectDetails = useApiQuery<ProjectFormSchemaType>({
    key: ["project-view", id],
    url: `/project-view/${id}`,
  });
  return {
    project: projectDetails.data ?? null,
    isLoading: projectDetails.isLoading,
    isError: !!projectDetails.error,
    error: projectDetails.error,
  };
};

// Hook for fetching project details
export const useCheckViceManagerPermission = (id: string) => {
  const hasPermission = useApiQuery<ViceManagerPermissionResponse>({
    key: ["project-vice-permission", id],
    url: `/projects/${id}/vice-permission`,
    enabled: Boolean(id),
  });
  return hasPermission;
};

export const useEditProject = (id: string) => {
  // Mutation for updating project details
  const editDetails = useApiMutation<ProjectUpdateRequest>({
    url: `/projects/${id}`,
    method: "PUT",
    contentType: "application/json", // For FormData
    auth: true, // Assuming auth is required
  });

  const uploadPhoto = useApiMutation<FormData>({
    url: `/projects/${id}/update-image`,
    method: "POST",
    contentType: "multipart/form-data", // For FormData
    auth: true, // Assuming auth is required
  });

  return {
    uploadPhoto,
    editDetails,
  };
};

// Hook for fetching team details
export const useTeamDetails = (projectId: string) => {
  return useApiQuery<TeamDetailsResponse>({
    key: `teamDetails-${projectId}`,
    url: `/projects/${projectId}/team-details`,
    enabled: !!projectId, // Prevent fetching if no projectId
  });
};

// Hook for fetching team details for project manager dashboard
export const useTeamDetailsForDashboard = (projectId: string) => {
  return useApiQuery<TeamMemberDashboardResponse>({
    key: [`team-details-dashboard`, projectId],
    url: `/projects/${projectId}/team-members`,
    enabled: !!projectId, // Prevent fetching if no projectId
  });
};

// Hook for fetching team details for project manager dashboard
export const usePhases = (projectId: string) => {
  return useApiQuery<Phase[]>({
    key: ["phases-to-add", projectId],
    url: `/phase-list/${projectId}`,
    enabled: !!projectId, // Prevent fetching if no projectId
  });
};

export const useGetActivePhases = (projectId: string) => {
  return useApiQuery<Phase[]>({
    key: ["phases-active", projectId],
    url: `/phases-active/${projectId}`,
    enabled: !!projectId, // Prevent fetching if no projectId
  });
};

export const useGetArchivedPhases = (projectId: string) => {
  return useApiQuery<Phase[]>({
    key: ["phases-archived", projectId],
    url: `/phases-archived/${projectId}`,
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

  const toggleVicePermission = useApiMutation<null>({
    url: `/projects/${projectId}/toggle-vice-permission`,
    method: "PATCH",
    contentType: "application/json", // For FormData
    auth: true, // Assuming auth is required
  });

  const addPhases = useApiMutation<PhaseRequest>({
    url: `/phases/${projectId}`,
    method: "POST",
    contentType: "application/json", // For FormData
    auth: true, // Assuming auth is required
  });

  return {
    addTeamToProjects,
    cancelProject,
    removeProject,
    archiveUnarchiveProject,
    addProject,
    onholdProject,
    continueProject,
    toggleVicePermission,
    addPhases,
  };
};
