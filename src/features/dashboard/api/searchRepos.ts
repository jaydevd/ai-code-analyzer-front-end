import { api } from "./../../../lib/axios";

export async function searchRepos(query: string) {
  if (!query.trim()) return [];
  const response = await api.get(`/api/github/repos/search/?query=${query}`);
  return response.data.data;
}
