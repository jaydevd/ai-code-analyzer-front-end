import { useEffect, useState } from "react";
import { getChatMessages } from "../api/getChatMessages";
import type { Message } from "../types/dashboard.types";

const useGetChatMessages = (chatId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getChatMessages(chatId);
        setMessages(data);
      } catch (err) {
        setError("Failed to fetch chat messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  return { messages, loading, error };
};

export default useGetChatMessages;