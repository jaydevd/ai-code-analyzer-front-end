// auth.types.ts

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  github_username?: string;
  github_oauth_username?: string;
  github_installation_account_login?: string;
  is_github_installation_active?: boolean;
  is_github_login_linked?: boolean;
  is_github_repo_connected?: boolean;
  role?: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}
