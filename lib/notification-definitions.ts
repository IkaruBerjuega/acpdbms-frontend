export interface NotificationItem {
  id: string;
  content: string;
  category?: string;
  date: string;
  status?: string;
  project_id: string;
  project_title: string;
  seen: boolean;
  date_seen: string | null;
  user_id: string;
  user_name: string;
  task_id?: string;

  profile_picture_url: string;
}

export interface NotificationPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface NotificationsResponse {
  message: string;
  data: NotificationItem[];
  pagination: NotificationPagination;
}

export interface UnseenNotificationCount {
  count: number;
  message: string;
}

export interface NotificationFilters {
  filter: "today" | "last_3_days" | "last_7_days" | "last_30_days" | "all";
  page: string;
  role: "admin" | "employee" | "client";
}
