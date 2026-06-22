import { api } from "@/lib/axios";

export async function createChatSession(
  title = "Untitled Chat",
  repository?: string,
  branch?: string
) {
  const response = await api.post("/api/chat/session/new", {
    title,
    repository,
    branch,
  });
  return response.data.data;
}
