import { CellContext, HeaderContext, Row } from '@tanstack/react-table';
import { FilterType } from './filter-types';

export interface UserInterface {
  id: number;
  email: string;
  is_admin: boolean;
  role: 'admin' | 'employee' | 'client';
  profile_complete: boolean;
  must_change_password: boolean;
  profile_picture: string;
  name: string;
}

export interface LoginResponseInterface {
  token: string;
  user: UserInterface;
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

//team details response
export interface ProjectManager {
  id: number;
  name: string;
  role: 'Project Manager';
}

export interface TeamDetailsResponse {
  project_managers: ProjectManager[];
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
    | 'finished'
    | 'on-hold'
    | 'ongoing'
    | 'cancelled'
    | 'archived'
    | 'pending';
  location: string;
  image_url?: string | null;
  project_manager: string;
  project_description: string;
}

export interface ProjectDetailsInterface {
  id: string;
  client_id: number;
  client_name: string;
  project_title: string;
  start_date: string;
  end_date: string;
  finish_date?: string | undefined | null;
  status: 'finished' | 'on-hold' | 'ongoing' | 'cancelled' | 'archived';
  street: string;
  city_town: string;
  state: string;
  zip_code: number;
  image_url?: string | undefined | null;
  project_manager: string;
}

export interface ColumnInterface<T> {
  id?: string;
  accessorKey?: keyof T | string;
  header:
    | (() => React.JSX.Element)
    | (({ table }: HeaderContext<T, unknown>) => React.JSX.Element);
  meta?: FilterType;
  cell?: ({ row }: CellContext<T, unknown>) => React.JSX.Element;
  filterFn?: <T>(
    row: Row<T>,
    columnId: string,
    filterValues: string[]
  ) => boolean; // boolean because the system only uses one filter function
}

export interface ColumnInterfaceProp {
  id?: string;
  accessorKey?: string;
  header?: string;
  meta?: FilterType;
  cell?: boolean | React.JSX.Element;
  filterFn?: boolean; // boolean because the system only uses one filter function
  enableHiding?: boolean;
}

export type AccountActions =
  | 'sendReset'
  | 'deactivate'
  | 'archive'
  | 'activate'
  | 'unarchive'
  | undefined;

export type ProjectActions =
  | 'archive'
  //| "unarchive"
  | 'cancel'
  | 'remove'
  | 'onhold'
  | 'continue'
  | undefined;

export interface Breadcrumbs {
  href: string;
  pageName: string;
  active: boolean;
}

//types
export type SupportedTableTypes =
  | ClientInterface
  | EmployeeInterface
  | ProjectListResponseInterface;
export type SupportedTableName = 'Accounts' | 'Projects';
export type AccountsTableType = ClientInterface | EmployeeInterface;
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
