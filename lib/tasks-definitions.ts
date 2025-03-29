import { TaskFile } from "./files-definitions";

export interface TeamMember {
  full_name: string;
  profile_picture_url: string;
}

export const TASK_STATUSES = [
  "to do",
  "in progress",
  "cancelled",
  "paused",
  "needs review",
  "done",
] as const;

export type TaskStatuses = (typeof TASK_STATUSES)[number];

export interface TaskDetails {
  id: number;
  phase_category: string | null;
  task_name: string;
  status: TaskStatuses;
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
  team_member_name: string | undefined;
  profile_picture_url: string | undefined;
  status: string;
  content: string;
  reply_to: number | null;
  created_at: string;
}

export interface TaskCommentInterface {
  id: number;
  team_member_name?: string;
  profile_picture_url?: string;
  status: string;
  content: string;
  children?: TaskCommentInterface[]; // Optional replies
  created_at: string;
}

export interface TaskCommentsResponse {
  comments: TaskComment[];
}

export interface TaskCommentsResponse {
  comments: TaskComment[];
}

export interface TaskCommentRequest {
  content: string;
  reply_to: TaskComment["id"] | null;
}

export interface AssignTaskRequest {
  team_member_ids: string[];
}

export interface CancelTaskAssignmentRequest {
  assignment_id: number;
}

export type UploadFilesRequest = FormData;

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

export interface TaskItem {
  id: number;
  phase_category: string;
  task_name: string;
  task_description: string;
  status:
    | "to do"
    | "in progress"
    | "paused"
    | "done"
    | "needs review"
    | "cancelled";
  assigned_team_members: TeamMember[];
  task_comments_count: number;
  task_files_count: number;
  approved_files_count: string | null;
  rejected_files_count: string | null;
  remaining_duration: number;
  total_duration: number;
  version: number;
  start_date: string;
  finish_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TasksResponse {
  tasks: TaskItem[];
}

export interface TaskItemProps extends TaskItem {
  phaseColor: {
    light: string;
    dark: string;
  };
}

export interface ReviewTaskRequest {
  approved: boolean;
  new_task_description: string;
  new_duration: number;
}
