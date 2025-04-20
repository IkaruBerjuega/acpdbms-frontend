export interface OnlineUser {
  name: string;
  role: string;
}

export interface DashboardStatistics {
  ongoing_projects: number;
  finished_projects: number;
}

export interface TaskStatistics {
  in_progress_tasks: number;
  needs_review_tasks: number;
  done_tasks: number;
}

export type TaskCountIntervalTypes =
  | "7_days"
  | "4_weeks"
  | "12_months"
  | "3_years";

export interface TaskStatsGraphData {
  date?: string;
  week?: string;
  month?: string;
  year?: string;
  in_progress: number;
  needs_review: number;
  done: number;
}

export interface ProjectLocation {
  city_town: string;
  state: string;
  project_count: number;
}

export interface EmployeeWorkHours {
  user_id: number;
  full_name: string;
  hours: number;
}

export interface TicketDetails {
  ticket_id: number;
  user_name: string | null;
  project_id: number;
  category: string;
  content: string;
  date: string | null;
  status: string;
}
