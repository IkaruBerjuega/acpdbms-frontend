import { CellContext, HeaderContext, Row } from "@tanstack/react-table";
import { FilterType } from "./filter-types";
import { File as FileObject } from "./files-definitions";

export interface UserInterface {
  id: number;
  email: string;
  is_admin: boolean;
  role: "admin" | "employee" | "client";
  profile_complete: boolean;
  must_change_password: boolean;
  profile_picture: string;
  name: string;
}

export interface LoginResponseInterface {
  token: string;
  user: UserInterface;
}

export interface UserBasicInfo {
  full_name: string;
  email: string;
  profile_picture_url: string;
  position: string;
}

export interface EmployeeInterface {
  id: number;
  user_id: number;
  full_name: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  position: string;
  email: string;
  status: string;
  has_ongoing_task?: boolean;
  profile_picture_url?: string;
}

export interface ClientInterface {
  id: number;
  user_id: number;
  full_name: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  status: string;
  profile_picture_url?: string;
}

export interface Manager {
  id: number;
  name: string;
  role: "Project Manager" | "Vice Manager";
}

export interface TeamDetailsResponse {
  managers: Manager[];
  activated_accounts: EmployeeInterface[];
  other_employees: EmployeeInterface[];
}

export interface ProjectListResponseInterface {
  id: string;
  client_name: string;
  project_title: string;
  start_date: string;
  end_date: string;
  finish_date?: string | null;
  status:
    | "finished"
    | "on-hold"
    | "ongoing"
    | "cancelled"
    | "archived"
    | "pending";
  location: string;
  image_url: string | null;
  project_manager: string;
  project_description: string;
  user_role?: "Project Manager" | "Vice Manager" | "Member";
}

export interface ProjectDetailsInterface {
  id: string;
  client_id: number;
  client_name: string;
  project_title: string;
  project_description: string;
  start_date: string;
  end_date: string;
  finish_date?: string | null;
  status: "finished" | "on-hold" | "ongoing" | "cancelled" | "archived";

  street: string;
  city_town: string;
  state: string;
  zip_code: number;
  image_url?: string | null;
  project_manager: string;
}

export interface ColumnInterface<T> {
  id?: string;
  accessorKey?: keyof T | string;
  header:
    | (() => JSX.Element)
    | (({ table }: HeaderContext<T, unknown>) => JSX.Element);
  meta?: FilterType;
  cell?: ({ row }: CellContext<T, unknown>) => JSX.Element;
  filterFn?: <T>(
    row: Row<T>,
    columnId: string,
    filterValues: string[]
  ) => boolean;
}

export interface ColumnInterfaceProp {
  id?: string;
  accessorKey?: string;
  header?: string;
  meta?: FilterType;
  cell?: boolean | JSX.Element;
  filterFn?: boolean;
  enableHiding?: boolean;
}

export type AccountActions =
  | "sendReset"
  | "deactivate"
  | "archive"
  | "activate"
  | "unarchive"
  | undefined;

export type ProjectActions =
  | "archive"
  //| "unarchive"
  | "cancel"
  | "remove"
  | "onhold"
  | "continue"
  | undefined;

export interface Breadcrumbs {
  href: string;
  pageName: string;
  active: boolean;
}

export interface ProjectSelector {
  projectId: string;
  projectName: string;
  userRole?: ProjectListResponseInterface["user_role"];
  hasVicePermission: boolean;
}

export const ItemTypes = {
  TASK: "task" as const,
};

export interface TeamMemberDashboard {
  teammember_id: number;
  employee_id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  task_counts: {
    "to do": number;
    "in progress": number;
    "needs review": number;
    paused: number;
    done: number;
    cancelled: number;
  };
  profile_picture_url?: string;
  has_task: boolean;
}

export interface TeamMemberDashboardResponse {
  team_members: TeamMemberDashboard[];
}

export interface ViceManagerPermissionResponse {
  vice_manager_permission?: boolean;
}

export interface Phase {
  id: string;
  category: string;
  created_at?: Date;
  finish_date?: Date;
  project_id?: string;
  status:
    | "to do"
    | "in progress"
    | "cancelled"
    | "paused"
    | "archived"
    | "finished";
  updated_at?: Date;
}

export interface PhaseInput {
  category: string;
}

export interface PhaseRequest {
  phases: PhaseInput[];
}

export type SupportedTableTypes =
  | ClientInterface
  | EmployeeInterface
  | ProjectListResponseInterface;

export interface ClientViewInterface {
  id: number;
  user_id: number;
  full_name: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  profile_picture_url?: string;
  phone_number?: string;
  street?: string;
  city_town?: string;
  state?: string;
  zip_code?: string;
  position?: string;
}

export interface EmployeeViewInterface {
  id: number;
  user_id: number;
  phone_number?: string;
  full_name: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  street?: string;
  city_town?: string;
  state?: string;
  zip_code?: string;
  position: string;
  email: string;
  has_ongoing_task?: boolean;
  profile_picture_url?: string;
}

export interface UserDetailsResponse {
  id: number;
  email: string;
  status: string;
  is_admin: boolean;
  profile_picture_url: string | null;
  employee: EmployeeViewInterface | null;
  client: ClientViewInterface | null;
}

export type TaskCountIntervalTypes = "daily" | "weekly" | "monthly" | "yearly";
export type TaskCountByInterval = {
  period: string;
  ongoing_tasks: number;
  completed_tasks: number;
};

export type TicketData = {
  ticket_id: number;
  user_name: string;
  project_id: number;
  category: string;
  content: string;
  date: string;
  status: string;
};

export interface CustomTabsProps {
  activeTab: string | null;
  tabItems: {
    item: string;
    action: () => void;
  }[];
}

// Interface for a single task in the request
export interface TaskRequest {
  phase_id: string; // Required, must exist in phases table
  phase_name: string;
  task_name: string; // Required string
  task_description?: string; // Optional (nullable) string
  duration?: string; // Optional (nullable) integer
}

// Interface for the full request body
export interface StoreTaskRequest {
  tasks: TaskRequest[]; // Required array of TaskRequest objects
}

export type SupportedTableName = "Accounts" | "Projects";
export type AccountsTableType = ClientInterface | EmployeeInterface;

export interface RecentProject {
  id?: number | null;
  project_title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface LogoResponse {
  message: string;
  logo_url?: string;
}

export interface RecentProjectsResponse {
  message: string;
  recent_project_images?: RecentProject[] | null;
}

export interface MaintenanceModeResponse {
  message: string;
  maintenance_mode: boolean;
}

export interface ContactDetails {
  id?: number;
  type: string;
  value: string;
}

export interface DynamicContactSchema {
  contact_details: ContactDetails[];
  removedIds: number[];
}

// Type for logo upload
export interface UploadLogoType {
  logo: FileList;
}

// Type for recent projects upload
export interface UploadRecentProjectsType {
  project_titles: string[];
  project_images: File[];
}

export interface UploadImage {
  file?: File | string;
}

export interface UploadData {
  content: string;
  images?: UploadImage[];
}

interface Filters {
  projectId: number;
  phaseId: number | null;
  taskId: number | null;
  versionId: number | null;
  sortBy: keyof File;
  sortOrder: "asc" | "desc";
}
