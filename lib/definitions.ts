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
}

export interface ProjectListResponseInterface {
  id: string;
  client_name: string;
  project_title: string;
  start_date: string;
  end_date: string;
  finish_date?: string | null;
  status: 'finished' | 'on-hold' | 'ongoing' | 'cancelled' | 'archived';
  location: string;
  image_url?: string | null;
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
  id_string?: string;
  accessorKey_string?: string;
  header_string?: string;
  meta?: FilterType;
  cell_string?: boolean;
  filterFn?: boolean; // boolean because the system only uses one filter function
  enableHiding?: boolean;
}

export interface ClientListResponseInterface {
  id: string;
  user_id: string;
  full_name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  status: string;
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

export type CheckboxData = ClientListResponseInterface;
