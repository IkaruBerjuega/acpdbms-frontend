export interface BasicInfo {
  id: number;
  profile_picture_url: string | null;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_number: string;
  street: string;
  city_town: string;
  state: string;
  zip_code?: string;
  position?: string;
}

export interface UpdateUserInfoRequest {
  first_name: string; // 'sometimes' means it's optional
  middle_name: string;
  last_name: string;
  phone_number: string;
  street: string;
  city_town: string;
  state: string;
  zip_code?: string;
}

export interface UserInfoInterface {
  id: number;
  email: string;
  status: string;
  profile_complete: boolean;
  profile_picture_url: string | null;
  employee: BasicInfo;
  client: BasicInfo;
}

export interface NotificationsInterface {
  email_notifications: boolean;
  system_notifications: boolean;
}

export interface NewEmailCheckRequest {
  new_email: string;
}

export interface Email2FARequest {
  email: string;
}

export interface UpdateEmailRequest {
  new_email: string;
  two_factor_code: string;
}

export interface PasswordChangeFormProps {
  current_password: string;
  confirm_password: string;
  new_password: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ResetPasswordRequestByUser {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ValidateTokenRequest {
  email: string;
  token: string;
}

export interface ChangePassByUserFormProps {
  new_pass: string;
  confirm_new_pass: string;
}
