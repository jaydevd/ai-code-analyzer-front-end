import { api } from "./../../../lib/axios";

export async function getRepos() {
  const response = await api.get(`api/github/repos/`);
  const data = response.data.data;
  return data;
}
