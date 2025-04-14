import { useApiMutation, useApiQuery } from "@/hooks/tanstack-query";
import {
  TaskFilesApprovalRequest,
  FilesResponse,
  FileActionsRequest,
} from "@/lib/files-definitions";

// Hook for fetching the project list
export const useFileList = <T extends FilesResponse>({
  initialData,
  projectId,
}: {
  initialData?: T;
  projectId: string;
}) => {
  return useApiQuery<T>({
    key: ["files", projectId],
    url: `/projects/${projectId}/files`,
    initialData: initialData,
    enabled: Boolean(projectId),
  });
};

export default function useFileActions({
  projectId,
  taskVersionId,
}: {
  projectId?: string;
  taskVersionId?: string;
}) {
  //additional headers
  const additionalHeaders: Record<string, string> = {
    "X-Project-ID": projectId ?? "",
  };

  const updateProjectManagerApproval = useApiMutation<TaskFilesApprovalRequest>(
    {
      url: "/task-files/project-manager-approval",
      method: "POST",
      contentType: "application/json",
      auth: true,
      additionalHeaders,
    }
  );

  const updateClientApproval = useApiMutation<TaskFilesApprovalRequest>({
    url: "/task-files/client-approval",
    method: "POST",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const archiveFiles = useApiMutation<FileActionsRequest>({
    url: `/task-files/archive/${taskVersionId}`,
    method: "POST",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const deleteFiles = useApiMutation<FileActionsRequest>({
    url: "/files/delete-archived",
    method: "DELETE",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  const downloadFiles = useApiMutation<FileActionsRequest>({
    url: "/task-files/group-download",
    method: "POST",
    contentType: "application/json",
    auth: true,
    additionalHeaders,
  });

  return {
    updateProjectManagerApproval,
    updateClientApproval,
    archiveFiles,
    deleteFiles,
    downloadFiles,
  };
}
