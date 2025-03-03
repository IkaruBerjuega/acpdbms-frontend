import { CellContext, HeaderContext, Row } from "@tanstack/react-table";
import { FilterType } from "./filter-types";

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
  | "sendReset"
  | "deactivate"
  | "archive"
  | "activate"
  | "unarchive"
  | undefined;

export interface Breadcrumbs {
  href: string;
  pageName: string;
  active: boolean;
}

//types
export type SupportedTableTypes = ClientInterface | EmployeeInterface;
export type SupportedTableName = "Accounts" | "Projects";
export type AccountsTableType = ClientInterface | EmployeeInterface;
