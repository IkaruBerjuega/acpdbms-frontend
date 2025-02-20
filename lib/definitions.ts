interface UserInterface {
  id: number;
  email: string;
  is_admin: boolean;
  role: "admin" | "employee" | "client";
  profile_complete: boolean;
  must_change_password: boolean;
  profile_picture: string;
  name: string;
}

interface LoginResponseInterface {
  token: string;
  user: UserInterface;
}

interface EmployeeInterface {
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

interface ClientInterface {
  id: number;
  user_id: number;
  full_name: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  status: string;
}
