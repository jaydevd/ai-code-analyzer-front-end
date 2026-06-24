import { api } from "@/lib/axios";
import type { ScanReportResponse } from "../types/dashboard.types";

export async function getScanReport(repoId: string): Promise<ScanReportResponse> {
  const response = await api.get(`/api/github/repos/${repoId}/scan-report/`);
  return response.data;
}
