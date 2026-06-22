// auth.types.ts

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  github_username?: string;
  is_github_installation_active?: boolean;
  role?: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}
