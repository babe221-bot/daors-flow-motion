export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  roles: string[];
  permissions: string[];
  is_active: boolean;
  email_verified: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  roles?: string[];
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  roles?: string[];
  is_active?: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
  permissions: string[];
  is_active: boolean;
  email_verified: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
}