export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
}

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  github_username?: string;
  is_github_installation_active?: boolean;
  role?: string;
}
