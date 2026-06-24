import { api } from "@/lib/axios";
import type { AdminStats, ScanStatsOverTime } from "../types/admin.types";

export async function getAdminStats(): Promise<AdminStats> {
  const response = await api.get<AdminStats>("/admin/stats/");
  return response.data;
}

export async function getScanStatsOverTime(): Promise<ScanStatsOverTime[]> {
  const response = await api.get<ScanStatsOverTime[]>("/admin/stats/scans-over-time/");
  return response.data;
}
