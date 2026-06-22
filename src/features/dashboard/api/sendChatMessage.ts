import { store } from "@/app/store";

interface SendChatOptions {
  repoName?: string;
  branchName?: string;
  chatId: string;
}

export async function sendChatStream(
  prompt: string,
  options: SendChatOptions,
  signal?: AbortSignal
): Promise<Response> {
  const state = store.getState();
  const token = state.auth.accessToken;

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/query/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt,
      repo: options.repoName,
      branch: options.branchName,
      chat_id: options.chatId,
    }),
    signal,
  });

  return response;
}