import { api } from "./../../../lib/axios";

export async function installGithubApp() {
  const response = await api.get('api/github/install-url/');
  return response.data;
}
