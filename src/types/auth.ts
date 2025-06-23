export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  created_at?: string;
  updated_at?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
  updated_at?: string;
}

export type UserRole = "admin" | "user";

export interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UseUserRoleReturn {
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
}
