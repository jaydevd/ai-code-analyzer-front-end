import { api } from "@/lib/axios";
import type { Message } from "../types/dashboard.types";

interface BackendMessage {
  id: string;
  chat_id: string;
  prompt: string;
  content: string;
  created_at: number;
  updated_at: number;
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  const response = await api.get(`/api/chat/session/${chatId}/`);
  const data = response.data.data;
  const backendMessages: BackendMessage[] = data.messages ?? [];

  const messages: Message[] = [];

  for (const msg of backendMessages) {
    messages.push({
      id: `${msg.id}-user`,
      content: msg.prompt,
      role: "user",
      timestamp: new Date(msg.created_at * 1000).toISOString(),
      chat_id: msg.chat_id,
    });
    if (msg.content) {
      messages.push({
        id: `${msg.id}-assistant`,
        content: msg.content,
        role: "assistant",
        timestamp: new Date(msg.updated_at * 1000).toISOString(),
        chat_id: msg.chat_id,
      });
    }
  }

  return messages;
}
