import { useApiMutation, useApiQuery } from "@/hooks/tanstack-query";
import { StoreTaskRequest } from "@/lib/form-constants/form-constants";
import {
  AssignTaskRequest,
  CancelTaskAssignmentRequest,
  ReviewTaskRequest,
  TaskAssignmentDetailsResponse,
  TaskCommentRequest,
  TaskCommentsResponse,
  TaskDetails,
  TasksResponse,
  TaskVersionsResponse,
  UploadFilesRequest,
} from "@/lib/tasks-definitions";

export const useGetTasks = ({
  projectId,
  initialData,
  isGeneral,
}: {
  projectId: string; // Allow undefined
  initialData?: TasksResponse;
  isGeneral: boolean;
}) => {
  if (isGeneral) {
    return useApiQuery<TasksResponse>({
      key: ["tasks", projectId],
      url: `/projects/${projectId}/tasks`,
      initialData: { tasks: [] },
      enabled: Boolean(projectId),
    });
  }

  return useApiQuery<TasksResponse>({
    key: ["my-tasks", projectId],
    url: `/projects/${projectId}/assigned-tasks`,
    initialData: { tasks: [] },
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

export const useGetSpecificTaskVersions = ({
  taskId,
  initialData,
}: {
  taskId: string;
  initialData?: TaskVersionsResponse;
}) => {
  return useApiQuery<TaskVersionsResponse>({
    key: ["task-versions", taskId],
    url: `/tasks/${taskId}/versions`,
    enabled: Boolean(taskId),
    initialData: initialData,
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
  taskVersionId,
}: {
  projectId?: string;
  phaseId?: string;
  taskId?: string;
  taskVersionId?: number;
}) => {
  const addTasks = useApiMutation<StoreTaskRequest>({
    url: `/tasks/${projectId}`,
    method: "POST",
    contentType: "application/json",
    auth: true,
  });

  //additional headers
  const additionalHeaders: Record<string, string> = {
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

  const uploadDeliverables = useApiMutation<UploadFilesRequest>({
    url: `/tasks/${taskVersionId}/files/deliverable`,
    method: "POST",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const uploadReferences = useApiMutation<UploadFilesRequest>({
    url: `/tasks/${taskVersionId}/files/reference`,
    method: "POST",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const storeComment = useApiMutation<TaskCommentRequest>({
    url: `/tasks/${taskId}/comments`,
    method: "POST",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const startTask = useApiMutation<null>({
    url: `/tasks/${taskId}/start`,
    method: "POST",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const pauseTask = useApiMutation<null>({
    url: `/tasks/${taskId}/pause`,
    method: "POST",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const setTaskToNeedsReview = useApiMutation<null>({
    url: `/tasks/${taskId}/needs-review`,
    method: "PATCH",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const cancelTask = useApiMutation<null>({
    url: `/tasks/${taskId}/cancel`,
    method: "POST",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const reviewTask = useApiMutation<ReviewTaskRequest>({
    url: `/tasks/${taskId}/review`,
    method: "POST",
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
    uploadDeliverables,
    uploadReferences,
    storeComment,
    startTask,
    pauseTask,
    setTaskToNeedsReview,
    cancelTask,
    reviewTask,
  };
};
