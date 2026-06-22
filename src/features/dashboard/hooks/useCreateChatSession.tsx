import { useState } from "react";
import { createChatSession } from "../api/createChatSession";

const useCreateChatSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (
    title?: string,
    repository?: string,
    branch?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createChatSession(title, repository, branch);
      return data;
    } catch (err) {
      const message = "Failed to create chat session";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createSession, loading, error };
};

export default useCreateChatSession;
