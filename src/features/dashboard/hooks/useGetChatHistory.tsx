import { useCallback, useEffect, useState } from "react";
import { getChatHistory } from "../api/getChatHistory";
import type { ChatHistoryItem } from "../types/dashboard.types";

const useGetChatHistory = () => {
  const [chats, setChats] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
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
    };

    fetchChats();
  }, [refreshKey]);

  return { chats, loading, error, refetch };
};

export default useGetChatHistory;