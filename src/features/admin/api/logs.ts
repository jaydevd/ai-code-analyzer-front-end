import { api } from "@/lib/axios";
import type { ErrorLog, PaginatedResponse } from "../types/admin.types";

export interface GetLogsParams {
  page?: number;
  level?: string;
  source?: string;
  search?: string;
}

export async function getAdminLogs(params?: GetLogsParams): Promise<PaginatedResponse<ErrorLog>> {
  const response = await api.get<PaginatedResponse<ErrorLog>>("/admin/logs/", { params });
  return response.data;
}
