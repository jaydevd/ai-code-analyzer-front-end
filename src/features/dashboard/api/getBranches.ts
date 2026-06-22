import { api } from "./../../../lib/axios";

export async function getBranches(repo: string) {
  const response = await api.get(`/api/github/repos/${repo}/branches/`);
  return response.data.data;
}