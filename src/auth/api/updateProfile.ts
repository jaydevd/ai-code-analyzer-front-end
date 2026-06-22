import { store } from "@/app/store";
import { api } from "@/lib/axios";

export async function updateProfile(data: {
  first_name?: string;
  last_name?: string;
}) {
  const response = await api.patch("/auth/user/", data);
  return response.data;
}

export async function logoutRequest() {
  const state = store.getState();
  console.log('state: ', state);
  const refreshToken = state.auth.refreshToken;
  console.log('refreshToken: ', refreshToken);
  const response = await api.post("/auth/logout/", { refresh: refreshToken });
  return response.data;
}

export async function changePassword(data: {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}) {
  const response = await api.post("/auth/password/change/", data);
  return response.data;
}

export async function deleteAccount() {
  const response = await api.delete("/auth/user/");
  return response.data;
}
