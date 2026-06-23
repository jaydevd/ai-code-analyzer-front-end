import { api } from "@/lib/axios";
import type { AdminRepo, PaginatedResponse } from "../types/admin.types";

export interface GetReposParams {
  page?: number;
  search?: string;
  status?: string;
  owner_id?: string;
}

export async function getAdminRepos(params?: GetReposParams): Promise<PaginatedResponse<AdminRepo>> {
  const response = await api.get<PaginatedResponse<AdminRepo>>("/admin/repos/", { params });
  return response.data;
}

export async function deleteAdminRepo(id: string): Promise<void> {
  await api.delete(`/admin/repos/${id}/`);
}

export async function rescanAdminRepo(id: string): Promise<void> {
  await api.post(`/admin/repos/${id}/rescan/`);
}
