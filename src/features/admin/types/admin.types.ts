export interface AdminStats {
  total_users: number;
  active_users: number;
  total_repos: number;
  scanned_repos: number;
  total_chats: number;
  scans_today: number;
  failed_scans: number;
  avg_scan_duration_seconds: number;
}

export interface ScanJob {
  id: string;
  repository_id: string;
  repository_name: string;
  repository_full_name: string;
  user_id: string;
  user_email: string;
  branch: string;
  commit_sha: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  error_message: string | null;
  error_log: string | null;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  github_username: string | null;
  role: string;
  is_active: boolean;
  is_suspended: boolean;
  is_github_installation_active: boolean;
  repo_count: number;
  chat_count: number;
  last_login: string | null;
  created_at: string;
}

export interface AdminRepo {
  id: string;
  name: string;
  full_name: string;
  owner_id: string;
  owner_email: string;
  private: boolean;
  language: string | null;
  status: 'not_scanned' | 'scanning' | 'scanned' | 'failed';
  branch_count: number;
  file_count: number;
  chunk_count: number;
  last_scanned: string | null;
  created_at: string;
}

export interface ErrorLog {
  id: string;
  level: 'error' | 'warning' | 'info';
  source: string;
  message: string;
  repository_name: string | null;
  user_email: string | null;
  stack_trace: string | null;
  created_at: string;
}

export interface ScanStatsOverTime {
  date: string;
  completed: number;
  failed: number;
  total: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
