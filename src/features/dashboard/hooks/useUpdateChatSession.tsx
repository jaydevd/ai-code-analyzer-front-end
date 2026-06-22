import { useState } from "react";
import { updateChatSession } from "../api/updateChatSession";

const useUpdateChatSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rename = async (chatId: string, title: string) => {
    setLoading(true);
    setError(null);
    try {
      return await updateChatSession(chatId, { title });
    } catch (err) {
      setError("Failed to rename chat session");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const archive = async (chatId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await updateChatSession(chatId, { is_archived: true });
    } catch (err) {
      setError("Failed to archive chat session");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (chatId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await updateChatSession(chatId, { is_deleted: true });
    } catch (err) {
      setError("Failed to delete chat session");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { rename, archive, deleteSession, loading, error };
};

export default useUpdateChatSession;
