import { api } from "@/lib/axios";

interface StartScanPayload {
  repo_id: string;
  commit_sha: string;
  branch: string;
}

export async function startScanRepo(payload: StartScanPayload) {
  const response = await api.post("/embed/repo/index/", payload);
  return response.data;
}
