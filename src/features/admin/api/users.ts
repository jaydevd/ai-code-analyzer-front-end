import { api } from "@/lib/axios";
import type { AdminUser, PaginatedResponse } from "../types/admin.types";

export interface GetUsersParams {
  page?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
  is_suspended?: boolean;
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
}

export async function getAdminUsers(params?: GetUsersParams): Promise<PaginatedResponse<AdminUser>> {
  const response = await api.get<PaginatedResponse<AdminUser>>("/admin/users/", { params });
  return response.data;
}

export async function getAdminUserDetail(id: string): Promise<AdminUser> {
  const response = await api.get<AdminUser>(`/admin/users/${id}/`);
  return response.data;
}

export async function updateAdminUser(id: string, data: UpdateUserPayload): Promise<AdminUser> {
  const response = await api.patch<AdminUser>(`/admin/users/${id}/`, data);
  return response.data;
}

export async function deleteAdminUser(id: string): Promise<void> {
  await api.delete(`/admin/users/${id}/`);
}

export async function suspendUser(id: string): Promise<void> {
  await api.post(`/admin/users/${id}/suspend/`);
}

export async function activateUser(id: string): Promise<void> {
  await api.post(`/admin/users/${id}/activate/`);
}
