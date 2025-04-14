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

export interface editAccountDetails {
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number?: string;
  street?: string;
  city_town?: string;
  state?: string;
  zip_code?: string;
  profile_picture_url?: string;
  position?: string;
}
export interface adminUpdateProfile {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  street?: string;
  city_town?: string;
  state?: string;
  zip_code?: string;
  phone_number?: string;
  position?: string;
  email?: string;
}

export interface updateProfile {
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number?: string;
  state?: string;
  city_town?: string;
  street?: string;
  zip_code?: string;
}
