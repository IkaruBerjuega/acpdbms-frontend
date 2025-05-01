import { SetStateAction } from "react";

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
  project_manager_approval: boolean | null;
  client_approval: boolean | null;
}

export interface TaskFilesApproval {
  task_file_id: number;
  approval: boolean | null;
}

export interface TaskFilesApprovalRequest {
  approvals: TaskFilesApproval[];
}

export interface File {
  file_id: string;
  phase_id: string; // Phase ID
  phase_category: string; // Phase Category

  task_id: string; // Task ID
  task_name: string; // Task Name
  task_version_id: string; // Task Version ID
  task_version_number: number; // Task Version Number

  name: string;
  path: string;
  size: number;
  type: string;
  category: string;
  uploaded_by: string; // User ID as string
  uploaded_at: string; // ISO DateTime string
  is_archived: boolean;
}

export interface FilesResponse {
  files: File[];
}

export interface FilesPageProps {
  query?: string;
  archived?: "true";
  projectId?: string;
  phaseId?: string;
  taskId?: string;
  taskVersionId?: string;
  tab?: "card" | "row";
  filters?: "true";
}

export interface FileUIProps {
  file: File;
  projectId: string;
  filteredFiles: File[];
  firstIndex: number;
  setFirstIndex: React.Dispatch<SetStateAction<number>>;
  secondIndex: number;
  setSecondIndex: React.Dispatch<SetStateAction<number>>;
  role: "admin" | "employee" | "client";
}

export interface FileActionsRequest {
  file_ids: string[];
}
