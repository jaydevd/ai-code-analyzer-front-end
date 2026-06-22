import { api } from "@/lib/axios";

export async function updateChatSession(
  chatId: string,
  payload: {
    title?: string;
    is_archived?: boolean;
    is_deleted?: boolean;
  }
) {
  const response = await api.patch(`/api/chat/session/${chatId}/`, payload);
  return response.data.data;
}
