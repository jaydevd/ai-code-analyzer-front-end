import { api } from "./../../../lib/axios";

export async function getChatHistory() {
  const response = await api.get("/api/chat/history/");
  return response.data.data;
}