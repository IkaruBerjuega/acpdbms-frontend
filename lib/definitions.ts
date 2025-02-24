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

export interface Project {
  id: number;
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
