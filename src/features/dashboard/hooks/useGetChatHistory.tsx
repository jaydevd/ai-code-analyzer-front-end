import { useCallback, useState } from "react";
import { getChatHistory } from "../api/getChatHistory";
import type { ChatHistoryItem } from "../types/dashboard.types";

const useGetChatHistory = () => {
  const [chats, setChats] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChatHistory();
      setChats(data);
    } catch (err) {
      setError("Failed to fetch chat history");
    } finally {
      setLoading(false);
    }
  }, []);

  return { chats, loading, error, refetch };
};

export default useGetChatHistory;