import { useApiMutation, useApiQuery } from "@/hooks/tanstack-query";
import { TaskItem, Tasks } from "@/lib/definitions";
import { StoreTaskRequest } from "@/lib/form-constants/form-constants";
import {
  AssignTaskRequest,
  CancelTaskAssignmentRequest,
  TaskAssignmentDetailsResponse,
  TaskCommentsResponse,
  TaskDetails,
  TaskVersionsResponse,
} from "@/lib/tasks-definitions";

export const useGetTasks = ({
  projectId,
  initialData,
}: {
  projectId: string; // Allow undefined
  initialData?: Tasks;
}) => {
  return useApiQuery<Tasks>({
    key: ["tasks", projectId],
    url: `/projects/${projectId}/tasks`,
    initialData: initialData,
    enabled: Boolean(projectId),
  });
};

export const useGetSpecificTask = ({ taskId }: { taskId: string }) => {
  return useApiQuery<TaskDetails>({
    key: ["task", taskId],
    url: `/tasks/${taskId}/details`,
    enabled: Boolean(taskId),
  });
};

export const useGetSpecificTaskVersions = ({ taskId }: { taskId: string }) => {
  return useApiQuery<TaskVersionsResponse>({
    key: ["task-versions", taskId],
    url: `/tasks/${taskId}/versions`,
    enabled: Boolean(taskId),
  });
};

export const useGetSpecificTaskComments = ({ taskId }: { taskId: string }) => {
  return useApiQuery<TaskCommentsResponse>({
    key: ["task-comments", taskId],
    url: `/tasks/${taskId}/comments`,
    enabled: Boolean(taskId),
  });
};

export const useGetTaskAssignedMembers = ({ taskId }: { taskId: string }) => {
  return useApiQuery<TaskAssignmentDetailsResponse[]>({
    key: ["task-members", taskId],
    url: `/tasks/${taskId}/team-members`,
    enabled: Boolean(taskId),
  });
};

export const useTaskActions = ({
  projectId,
  phaseId,
  taskId,
}: {
  projectId?: string;
  phaseId?: string;
  taskId?: string;
}) => {
  const addTasks = useApiMutation<StoreTaskRequest>({
    url: `/tasks/${projectId}`,
    method: "POST",
    contentType: "application/json",
    auth: true,
  });

  //additional headers
  let additionalHeaders: Record<string, string> = {
    "X-Project-ID": projectId ?? "",
  };

  const finishPhase = useApiMutation<null>({
    url: `/phases/${phaseId}/finish`,
    method: "PATCH",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const cancelPhase = useApiMutation<null>({
    url: `/phases/${phaseId}/cancel`,
    method: "PATCH",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const archivePhase = useApiMutation<null>({
    url: `/phases/${phaseId}/archive`,
    method: "PATCH",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const assignMultipleEmployeesToTask = useApiMutation<AssignTaskRequest>({
    url: `/tasks/${taskId}/assign`,
    method: "POST",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const cancelTaskAssignment = useApiMutation<CancelTaskAssignmentRequest>({
    url: `/task-assignments/cancel`,
    method: "PATCH",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  return {
    addTasks,
    assignMultipleEmployeesToTask,
    finishPhase,
    archivePhase,
    cancelPhase,
    cancelTaskAssignment,
  };
};
