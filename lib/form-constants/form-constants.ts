export interface ContactFormSchemaType {
  name: string;
  email: string;
  message: string;
}

export interface AccountActionSchemaType {
  user_ids: number[];
}

export interface AccountSendLinkSchemaType {
  email: string;
}

export type AccountActionsRequest =
  | AccountActionSchemaType
  | AccountSendLinkSchemaType;

export interface ProjectActionSchema {
  project_ids: string[];
}

export type LoginSchemaType = {
  email: string;
  password: string;
};

export interface addEmpAccountRequest {
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  position: string;
  street?: string;
  city_town?: string;
  state?: string;
  zip_code?: string;
  profile_picture_url?: string;
}

export interface addClientAccountRequest {
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  street?: string;
  city_town?: string;
  state?: string;
  zip_code?: string;
  profile_picture_url?: string;
}

export interface employeesToAssign {
  employee_id: string;
  employee_name: string;
  role?: "Project Manager" | "Vice Manager" | "Member";
}

export interface grantProjectAccessRequest {
  team: employeesToAssign[];
}

export interface grantProjectAccess {
  project_id: string;
  project_name: string;
  team: employeesToAssign[];
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
