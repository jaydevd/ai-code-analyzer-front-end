export interface Repository {
  id: string;
  name: string;
  language: string;
  status: "Ready" | "Analyzing";
  lastScan: string;
}

export interface Insight {
  id: string;
  message: string;
}

export interface Activity {
  id: string;
  action: string;
  timestamp: string;
}

export interface Branch {
  name: string;
  commit_sha: string;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  repository: string | null;
  branch: string | null;
  created_at: number;
  updated_at: number;
  is_deleted: boolean;
  is_archived: boolean;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  chat_id?: string;
}

export interface PreviousScan {
  commit_url: string;
  commit_sha: string;
  indexed_at: number;
}

export interface BranchScanReport {
  branch: string;
  status: "not_scanned" | "scanning" | "scanned" | "failed";
  last_indexed_at: number | null;
  previous_scans: PreviousScan[];
}

export interface ScanReportResponse {
  status: number;
  data: BranchScanReport[];
  message: string;
}