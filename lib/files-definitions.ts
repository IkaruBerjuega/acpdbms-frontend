export interface TaskFile {
  id: number;
  name: string;
  path: string;
  size: number;
  type: string;
  category: "references" | "deliverables";
  uploaded_by: string;
  uploaded_at: string;
  is_archived: boolean;
  status: string;
  project_manager_approval: boolean | undefined;
  client_approval: boolean | undefined;
}

export interface TaskFilesApproval {
  task_file_id: number;
  approval: boolean | null;
}

export interface TaskFilesApprovalRequest {
  approvals: TaskFilesApproval[];
}
