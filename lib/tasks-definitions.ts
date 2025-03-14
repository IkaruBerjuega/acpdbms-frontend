export interface TaskDetails {
  id: number;
  phase_category: string | null;
  task_name: string;
  status: string;
}

export interface TaskFile {
  id: number;
  name: string;
  path: string;
  size: number;
  type: string;
  category: string;
  uploaded_by: string;
  uploaded_at: string;
  is_archived: boolean;
  status: string;
}

export interface TaskVersion {
  id: number;
  version: number;
  task_description: string;
  start_date: string;
  finish_date: string;
  duration: number;
  remaining_duration: string;
  task_files: TaskFile[];
}

export interface TaskVersionsResponse {
  versions: TaskVersion[];
}

export interface TaskComment {
  id: number;
  team_member_name: string | null;
  profile_picture_url: string | null;
  status: string;
  content: string;
  reply_to: number | null;
  created_at: string;
}

export interface TaskCommentsResponse {
  comments: TaskComment[];
}

export interface TaskCommentsResponse {
  comments: TaskComment[];
}

export interface AssignTaskRequest {
  team_member_ids: number[];
}

export interface CancelTaskAssignmentRequest {
  assignment_id: number;
}

export interface TaskAssignmentDetailsResponse {
  team_member_name: string;
  position: string;
  role: "Member" | "Project Manager" | "Vice Manager";
  profile_picture_url: string;
  id: number;
  team_member_id: number;
  status: string;
  start_date: string;
  finish_date: string;
}
