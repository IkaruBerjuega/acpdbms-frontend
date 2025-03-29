import { useApiMutation } from "@/hooks/tanstack-query";
import { TaskFilesApprovalRequest } from "@/lib/files-definitions";

export default function useFileActions({ projectId }: { projectId?: string }) {
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

  return {
    updateProjectManagerApproval,
    updateClientApproval,
  };
}
