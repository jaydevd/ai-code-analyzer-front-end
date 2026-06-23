import { api } from "@/lib/axios";
import type { ScanJob, PaginatedResponse } from "../types/admin.types";

export interface GetScansParams {
  page?: number;
  status?: string;
  search?: string;
}

export async function getAdminScans(params?: GetScansParams): Promise<PaginatedResponse<ScanJob>> {
  const response = await api.get<PaginatedResponse<ScanJob>>("/admin/scans/", { params });
  return response.data;
}

export async function getAdminScanDetail(id: string): Promise<ScanJob> {
  const response = await api.get<ScanJob>(`/admin/scans/${id}/`);
  return response.data;
}

export async function retryScan(id: string): Promise<void> {
  await api.post(`/admin/scans/${id}/retry/`);
}
